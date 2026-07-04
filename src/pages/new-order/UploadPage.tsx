import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PhotoAnalysis = {
  detectedGarment: string;
  detectedSubCategory: string;
  detectedGender: string;
  detectedColour: string;
  detectedFeel: string;
  detectedSurfaces: string[];
  detectedOccasion: string;
  confidence: string;
  analysisComplete: boolean;
  analysisError: boolean;
};

const UploadPage = () => {
  const navigate = useNavigate();
  const [inspirationPhoto, setInspirationPhoto] = useState<File | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<(File | null)[]>([null, null, null]);
  const [description, setDescription] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const analysePhoto = async (file: File) => {
    setAnalysisLoading(true);
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const prompt = `You are a fashion analyst for Naapio, an Indian ethnic wear platform. Analyse this garment image carefully.

Return ONLY a valid JSON object. No other text, no markdown, no explanation. Just the raw JSON.

{
  "detectedGarment": "Must be exactly one of: Saree Blouse, Kurti, Salwar Kameez, Anarkali, Lehenga, Gown, Co-ord Set, Chaniya Choli, Kurta, Sherwani, Bandhgala, Suit/Blazer, Indo-Western, Other",
  "detectedSubCategory": "Most specific sub-style or empty string",
  "detectedGender": "Women or Men",
  "detectedColour": "Must be exactly one of: Deep Reds, Pinks & Mauves, Blues & Indigos, Greens & Teals, Golds & Champagne, Ivory & Cream, Blacks & Charcoals, Whites & Silvers, Jewel Tones, Pastels, Multicolour",
  "detectedFeel": "Must be exactly one of: Light & Airy, Structured, Rich & Heavy, Crisp & Sharp, Soft & Draped, No Preference, or empty string",
  "detectedSurfaces": ["Array using only: Heavy Embroidery, Zardozi / Zari Work, Mirror Work, Sequence & Beadwork, Bandhani / Tie-Dye, Kalamkari / Block Print, Resham Thread Work, Cutwork / Lace, Digital Print, Appliqué, Plain / No Embellishment"],
  "detectedOccasion": "Must be exactly one of: Wedding / Baraat / Nikah, Reception / Cocktail, Festival (Diwali / Eid / Navratri), Garba / Dandiya Night, Casual / Daily Wear, Party / Night Out, or empty string",
  "confidence": "high if 4+ attributes clear, medium if 2-3, low if unclear"
}`;
      const response = await supabase.functions.invoke('gemini-proxy', {
        body: { callType: 'analyse', prompt, imageBase64: base64, mimeType: file.type || 'image/jpeg' }
      });
      if (response.error) throw new Error(response.error.message);
      const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const start = clean.indexOf('{'); const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1);
      const parsed = JSON.parse(clean);
      setPhotoAnalysis({ ...parsed, analysisComplete: true, analysisError: false });
    } catch {
      setPhotoAnalysis({
        detectedGarment: '', detectedSubCategory: '', detectedGender: '', detectedColour: '',
        detectedFeel: '', detectedSurfaces: [], detectedOccasion: '', confidence: 'low',
        analysisComplete: true, analysisError: true,
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handlePrimaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Photo must be under 8MB"); return; }
    setInspirationPhoto(file);
    setUploaded(true);
    analysePhoto(file);
  };

  const handleAdditionalUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("Photo must be under 8MB"); return; }
    setAdditionalPhotos(prev => {
      const copy = [...prev];
      copy[idx] = file;
      return copy;
    });
  };

  const handleNext = () => {
    if (inspirationPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('naapio_upload', JSON.stringify({
          photoDataUrl: reader.result,
          photoName: inspirationPhoto.name,
          description,
          photoAnalysis,
          timestamp: new Date().toISOString(),
        }));
        navigate('/new-order/payment');
      };
      reader.readAsDataURL(inspirationPhoto);
    } else {
      localStorage.setItem('naapio_upload', JSON.stringify({
        photoDataUrl: null, photoName: null, description, photoAnalysis: null,
        timestamp: new Date().toISOString(),
      }));
      navigate('/new-order/payment');
    }
  };

  const detectedPills: string[] = photoAnalysis && !photoAnalysis.analysisError
    ? [photoAnalysis.detectedGarment, photoAnalysis.detectedColour, photoAnalysis.detectedFeel, photoAnalysis.detectedOccasion]
        .filter(v => v && v !== 'Other')
    : [];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-4">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-serif font-bold text-lg text-foreground">Naapio</button>
          <p className="font-sans text-sm text-muted-foreground hidden sm:block">Step 1 of 3 — Upload Your Inspiration</p>
        </div>
        <div className="container mx-auto max-w-4xl mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: '33%' }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl pb-32 sm:pb-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Upload Your Inspiration</h2>
            <p className="font-sans text-muted-foreground mb-6">Any Instagram screenshot, WhatsApp forward, or Pinterest save</p>

            {!uploaded ? (
              <label className="h-[380px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 bg-card transition-colors">
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handlePrimaryUpload} />
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="font-sans font-medium text-foreground mb-1">Click to upload</p>
                <p className="text-sm text-muted-foreground">or drag and drop — JPG, PNG, WEBP up to 8MB</p>
              </label>
            ) : (
              <>
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <img src={URL.createObjectURL(inspirationPhoto!)} alt="Inspiration" className="h-[380px] w-full object-cover" />
                  <button
                    onClick={() => { setUploaded(false); setInspirationPhoto(null); setPhotoAnalysis(null); }}
                    className="absolute top-3 right-3 p-2 bg-card rounded-full shadow hover:bg-card/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-card/90 backdrop-blur rounded-full text-xs font-sans truncate max-w-[200px]">
                    {inspirationPhoto?.name}
                  </div>
                </div>

                {analysisLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-accent/10 rounded-xl flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-lg">✨</motion.span>
                    <span className="text-sm font-sans">Analysing your photo...</span>
                  </motion.div>
                )}

                {photoAnalysis?.analysisComplete && !photoAnalysis?.analysisError && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="font-sans font-semibold text-sm mb-3">✨ Detected in your photo</p>
                    <div className="flex flex-wrap gap-2">
                      {detectedPills.map(pill => (
                        <span key={pill} className="px-2.5 py-1 bg-card rounded-full text-xs font-sans border border-border">{pill}</span>
                      ))}
                      {photoAnalysis.detectedSurfaces?.length > 0 && (
                        <span className="px-2.5 py-1 bg-card rounded-full text-xs font-sans border border-border">
                          {photoAnalysis.detectedSurfaces[0]}
                          {photoAnalysis.detectedSurfaces.length > 1 && ` +${photoAnalysis.detectedSurfaces.length - 1} more`}
                        </span>
                      )}
                    </div>
                    {photoAnalysis.confidence === 'medium' && (
                      <p className="text-xs text-amber-700 mt-2">Some attributes detected — you can adjust in the next step</p>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="font-sans font-semibold text-foreground mb-4">Add more photos</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {additionalPhotos.map((f, i) => (
                <label key={i} className="aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-accent/50 bg-card overflow-hidden">
                  <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleAdditionalUpload(i, e)} />
                  {f ? (
                    <img src={URL.createObjectURL(f)} alt={`Additional ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </label>
              ))}
            </div>

            <label className="block font-sans font-semibold text-foreground mb-2">Describe what you love about this look</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I love the heavy zardozi border and deep red. Looking for something similar for my reception..."
              className="min-h-[150px] font-sans mb-4"
            />

            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <p className="flex items-start gap-2 text-sm font-sans"><span>📸</span> Screenshot from Instagram or Pinterest works perfectly</p>
              <p className="flex items-start gap-2 text-sm font-sans"><span>🎨</span> The AI reads your photo and pre-fills fabric, colour, and style</p>
              <p className="flex items-start gap-2 text-sm font-sans"><span>✏️</span> You review and adjust everything before paying</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border p-4 sm:static sm:mt-4 sm:pt-6">
        <div className="container mx-auto max-w-4xl flex justify-between gap-3">
          <Button variant="outline" onClick={() => navigate('/start')}>
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button variant="gold" onClick={handleNext} disabled={!uploaded && !description.trim()}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
