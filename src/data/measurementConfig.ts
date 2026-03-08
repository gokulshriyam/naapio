// ═══════════════════════════════════════════════════════════════
// Canonical Measurement Config — Single Source of Truth
// Used by Wizard.tsx (step 2e) and ActiveOrdersPage.tsx (M1)
// Keys MUST match the wizard's subCategories map exactly,
// since those are what gets saved to localStorage.
// ═══════════════════════════════════════════════════════════════

export type MeasurementField = {
  field: string;
  description: string;
  tip: string;
  videoUrl: string | null;
  /** Unit label shown in ActiveOrdersPage M1 inputs */
  unit?: 'inches';
  /** Alias used by ActiveOrdersPage for video tip display */
  videoTip?: string;
};

export type GarmentMeasurementConfig = {
  supportsStandard: boolean;
  heightRequired: boolean;
  noStitching?: boolean;
  noStitchingMessage?: string;
  /** ActiveOrdersPage compat alias */
  noMeasurementNeeded?: boolean;
  noMeasurementMessage?: string;
  fields: MeasurementField[];
};

export const HEIGHT_FIELD: MeasurementField = {
  field: 'Height',
  description: 'Your full standing height',
  tip: 'Stand straight against a wall. Mark the top of your head. Measure from floor to that mark. Enter in feet+inches (e.g. 5\'6") or cm (e.g. 168cm).',
  videoUrl: null,
};

// Helper to build a field with both Wizard and ActiveOrders compat props
const f = (field: string, description: string, tip: string): MeasurementField => ({
  field,
  description,
  tip,
  videoUrl: null,
  unit: 'inches',
  videoTip: tip,
});

export const MEASUREMENT_CONFIG: Record<string, GarmentMeasurementConfig> = {
  // ═══ WOMEN'S ═══

  'Saree (fabric only)': {
    supportsStandard: false, heightRequired: false,
    noStitching: true, noMeasurementNeeded: true,
    noStitchingMessage: "Saree is unstitched fabric — no measurements needed. If you're adding a blouse, please select 'Saree Blouse' as your category.",
    noMeasurementMessage: "Saree is unstitched fabric — no measurements needed. If adding a blouse, select Saree + Custom Blouse.",
    fields: [],
  },

  'Saree Blouse': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Bust', 'Fullest part of chest', 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.'),
      f('Under-bust', 'Just below the bust', 'Measure just below your bust where a bra band naturally sits.'),
      f('Waist', 'Natural waist (for blouse waist seam)', 'Measure your narrowest natural waist point.'),
      f('Shoulder width', 'Shoulder seam to seam', 'Measure across your upper back from one shoulder edge to the other.'),
      f('Armhole circumference', 'Around the arm opening', 'Measure around the armhole loosely — you need room for movement.'),
      f('Sleeve length', 'Shoulder point to desired sleeve end', 'From your shoulder point to where you want the sleeve to end.'),
      f('Sleeve end circumference', 'Around wrist or sleeve opening', 'Around your wrist bone, or the opening size you prefer.'),
      f('Blouse length — front', 'Front neckline to blouse hem', 'From the centre front neckline down to where you want the blouse to end.'),
      f('Blouse length — back', 'Back neckline to blouse hem', 'From the centre back neckline down to the blouse hem.'),
      f('Front neck depth', 'Depth of front neckline opening', 'From the shoulder seam down to the lowest point of your front neckline.'),
      f('Back neck depth', 'Depth of back neckline opening', 'From the shoulder seam down to the lowest point of your back neckline.'),
    ],
  },

  'Nauvari / 9-Yard Saree': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Waist', 'Natural waist', 'Natural waist measurement.'),
      f('Hip', 'Fullest hips', 'Fullest hip measurement.'),
      f('Length (waist to floor)', 'Waist to floor', 'From natural waist straight down to floor.'),
    ],
  },

  'Lehenga': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest (for choli)', 'Around fullest chest for the blouse.'),
      f('Under-bust', 'Below bust (for choli)', 'Just below bust where bra band sits.'),
      f('Waist', 'Natural waist', 'Narrowest natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hip measurement.'),
      f('Shoulder width', 'Shoulder to shoulder (for choli)', 'Across back, shoulder to shoulder.'),
      f('Armhole circumference', 'Around arm opening (for choli)', 'Around armhole, relaxed.'),
      f('Sleeve length', 'Shoulder to sleeve end (for choli)', 'Shoulder to desired sleeve end.'),
      f('Sleeve end circumference', 'Around wrist / sleeve opening', 'Around wrist or sleeve end opening.'),
      f('Blouse length — front', 'Front neckline to choli hem', 'Front neckline to where choli ends.'),
      f('Blouse length — back', 'Back neckline to choli hem', 'Back neckline to choli hem.'),
      f('Front neck depth', 'Front neckline depth', 'Shoulder seam to lowest front neckline point.'),
      f('Back neck depth', 'Back neckline depth', 'Shoulder seam to lowest back neckline.'),
      f('Skirt length (waist to floor)', 'Waist to floor for skirt', 'From waistband to floor — wear your heels when measuring if applicable.'),
    ],
  },

  'Bridal Lehenga (Full 3-piece Set)': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest (for choli)', 'Around fullest chest.'),
      f('Under-bust', 'Below bust', 'Below bust, bra band area.'),
      f('Waist', 'Natural waist', 'Narrowest waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole.'),
      f('Sleeve length', 'Shoulder to sleeve end', 'Shoulder to desired sleeve end.'),
      f('Sleeve end circumference', 'Around wrist / sleeve end', 'Around wrist or sleeve end.'),
      f('Blouse length — front', 'Front neckline to choli hem', 'Front neckline to choli hem.'),
      f('Blouse length — back', 'Back neckline to choli hem', 'Back neckline to choli hem.'),
      f('Front neck depth', 'Front neckline depth', 'Shoulder seam to lowest front neckline.'),
      f('Back neck depth', 'Back neckline depth', 'Shoulder seam to lowest back neckline.'),
      f('Skirt length (waist to floor)', 'Waist to floor', 'Waistband to floor, wearing heels if applicable.'),
      f('Heel height', 'Height of heels you will wear', 'Measure height of the specific heels you plan to wear on the day. This calibrates the skirt length.'),
    ],
  },

  // Alias — old wizard key
  'Bridal Lehenga': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest (for choli)', 'Around fullest chest.'),
      f('Under-bust', 'Below bust', 'Below bust, bra band area.'),
      f('Waist', 'Natural waist', 'Narrowest waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole.'),
      f('Sleeve length', 'Shoulder to sleeve end', 'Shoulder to desired sleeve end.'),
      f('Sleeve end circumference', 'Around wrist / sleeve end', 'Around wrist or sleeve end.'),
      f('Blouse length — front', 'Front neckline to choli hem', 'Front neckline to choli hem.'),
      f('Blouse length — back', 'Back neckline to choli hem', 'Back neckline to choli hem.'),
      f('Front neck depth', 'Front neckline depth', 'Shoulder seam to lowest front neckline.'),
      f('Back neck depth', 'Back neckline depth', 'Shoulder seam to lowest back neckline.'),
      f('Skirt length (waist to floor)', 'Waist to floor', 'Waistband to floor, wearing heels if applicable.'),
      f('Heel height', 'Height of heels you will wear', 'Measure height of the specific heels you plan to wear on the day.'),
    ],
  },

  'Chaniya Choli': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest (for choli)', 'Fullest chest.'),
      f('Under-bust', 'Below bust (for choli)', 'Below bust.'),
      f('Waist', 'Waist for chaniya waistband', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Chaniya length', 'Waist to desired hem', 'From waistband to desired hem.'),
      f('Shoulder width', 'Shoulder to shoulder (choli)', 'Across back.'),
      f('Armhole circumference', 'Around arm opening', 'Armhole circumference, relaxed.'),
      f('Blouse length — back', 'Back neckline to choli hem', 'Back neckline to choli hem.'),
    ],
  },

  'Salwar Kameez': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Bust', 'Fullest chest', 'Around fullest chest, tape parallel to floor.'),
      f('Waist', 'Natural waist', 'Narrowest natural waist.'),
      f('Hip', 'Fullest hips', 'Fullest hip measurement.'),
      f('Shoulder width', 'Shoulder seam to seam', 'Across upper back.'),
      f('Kameez length', 'Shoulder to hem', 'From shoulder to desired kameez length.'),
      f('Sleeve length', 'Shoulder to sleeve end', 'From shoulder to desired sleeve end.'),
      f('Sleeve width', 'Around upper arm (bicep area)', 'Around the fullest part of your upper arm.'),
      f('Neck depth', 'Front neckline depth', 'From shoulder seam to lowest front neckline point.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole — relaxed, not tight.'),
    ],
  },

  'Anarkali': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Bust', 'Fullest chest', 'Around fullest chest.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip', 'Fullest hips', 'Fullest hips.'),
      f('Shoulder width', 'Shoulder seam to seam', 'Across back, shoulder to shoulder.'),
      f('Anarkali length', 'Shoulder to desired hem', 'From highest shoulder point to desired hem.'),
      f('Sleeve length', 'Shoulder to sleeve end', 'Shoulder to desired sleeve end.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole, relaxed.'),
      f('Neck depth', 'Front neckline depth', 'Shoulder seam to lowest front neckline point.'),
    ],
  },

  'Kurti': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Bust', 'Fullest chest measurement', 'Around the fullest part of your chest, tape parallel to floor.'),
      f('Waist', 'Natural waist', 'Narrowest part of your natural waist.'),
      f('Hip', 'Fullest hips (if kurti is hip-length or longer)', 'Around the fullest part of your hips, approx 8 inches below your waist.'),
      f('Shoulder width', 'Shoulder seam to seam', 'Across your upper back from shoulder edge to shoulder edge.'),
      f('Kurti length', 'Highest shoulder point to hem', 'From the highest point of your shoulder straight down to where you want the kurti to end.'),
      f('Sleeve length', 'Shoulder point to desired sleeve end', 'From shoulder point to desired sleeve length.'),
      f('Armhole circumference', 'Around the arm opening', 'Around the armhole loosely for ease of movement.'),
    ],
  },

  'Gown': {
    supportsStandard: true, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest', 'Fullest chest measurement.'),
      f('Under-bust', 'Below bust', 'Below bust.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Sleeve length', 'Shoulder to sleeve end', 'Shoulder to desired sleeve end.'),
      f('Gown length', 'Shoulder to floor', 'From shoulder to floor — wear heels when measuring.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole.'),
      f('Heel height', 'Heel height for length calibration', 'Height of heels you will wear with this gown.'),
    ],
  },

  'Mermaid/Fishtail Gown': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest', 'Fullest chest.'),
      f('Under-bust', 'Below bust', 'Below bust.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Thigh circumference', 'Fullest thigh', 'Around fullest thigh.'),
      f('Knee circumference', 'Around knee', 'Around the knee.'),
      f('Calf circumference', 'Around fullest calf', 'Around the fullest calf.'),
      f('Ankle / flare opening', 'Ankle or desired flare start', 'Around ankle, or where you want the fishtail to start.'),
      f('Total length', 'Shoulder to floor', 'Shoulder to floor, wearing heels.'),
      f('Heel height', 'Heel height for calibration', 'Height of heels to be worn.'),
    ],
  },

  // Alias for old key
  'Mermaid / Fishtail Gown': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest', 'Fullest chest.'),
      f('Under-bust', 'Below bust', 'Below bust.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Thigh circumference', 'Fullest thigh', 'Around fullest thigh.'),
      f('Knee circumference', 'Around knee', 'Around the knee.'),
      f('Calf circumference', 'Around fullest calf', 'Around the fullest calf.'),
      f('Ankle / flare opening', 'Ankle or desired flare start', 'Around ankle, or where you want the fishtail to start.'),
      f('Total length', 'Shoulder to floor', 'Shoulder to floor, wearing heels.'),
      f('Heel height', 'Heel height for calibration', 'Height of heels to be worn.'),
    ],
  },

  'Lehenga Skirt Only': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips, approx 8 inches below waist.'),
      f('Skirt length (waist to floor)', 'Waist to floor', 'From waist straight to floor.'),
    ],
  },

  // Alias for old key
  'Lehenga Skirt': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips, approx 8 inches below waist.'),
      f('Skirt length (waist to floor)', 'Waist to floor', 'From waist straight to floor.'),
    ],
  },

  'Sharara Lehenga': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Bust', 'Fullest chest (for choli)', 'Fullest chest.'),
      f('Under-bust', 'Below bust', 'Below bust.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips', 'Fullest hips.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Thigh circumference', 'Fullest thigh', 'Around fullest thigh.'),
      f('Knee circumference', 'Around knee', 'Around knee.'),
      f('Ankle / hem opening', 'Around ankle', 'Around ankle.'),
      f('Outseam length', 'Waist to ankle (outside)', 'Outside leg from waist to ankle.'),
      f('Blouse length — front', 'Front neckline to choli hem', 'Front neckline to choli hem.'),
      f('Front neck depth', 'Front neckline depth', 'Depth of front neckline.'),
    ],
  },

  'Co-ord Set': {
    supportsStandard: true, heightRequired: false,
    fields: [
      // Top (Kurti-like)
      f('Bust', 'Fullest chest measurement', 'Around the fullest part of your chest.'),
      f('Waist', 'Natural waist', 'Narrowest part of your natural waist.'),
      f('Hip', 'Fullest hips', 'Around the fullest part of your hips.'),
      f('Shoulder width', 'Shoulder seam to seam', 'Across your upper back.'),
      f('Top length', 'Shoulder to top hem', 'From shoulder to where you want the top to end.'),
      f('Sleeve length', 'Shoulder to sleeve end', 'From shoulder point to desired sleeve length.'),
      // Bottom (Salwar/Pyjama-like)
      f('Outseam length', 'Waist to ankle (outside leg)', 'From waist to ankle, outside leg.'),
      f('Inseam length', 'Crotch to ankle (inside leg)', 'Inside leg from crotch to ankle.'),
      f('Thigh circumference', 'Fullest thigh', 'Around fullest thigh.'),
      f('Ankle / hem opening', 'Around ankle or desired opening', 'Around ankle or desired opening.'),
    ],
  },

  // ═══ BOTTOM SEPARATES ═══

  'Salwar / Churidar / Pyjama': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Waist', 'Where waistband sits', 'Around your waist where the waistband will sit.'),
      f('Hip / Seat', 'Fullest hip point', 'Fullest part of hips, usually 8 inches below waist.'),
      f('Thigh circumference', 'Around fullest thigh', 'Around the fullest part of your thigh when standing.'),
      f('Knee circumference', 'Around knee', 'Around the knee when standing straight.'),
      f('Calf circumference', 'Around fullest calf', 'Around the fullest part of your calf.'),
      f('Ankle / hem opening', 'Around ankle or desired opening', 'Around ankle, or the opening size you want at the hem.'),
      f('Inseam length', 'Crotch to ankle (inside leg)', 'From crotch seam down the inside of your leg to your ankle bone.'),
      f('Outseam length', 'Waistband to ankle (outside leg)', 'From the top of the waistband down the outside of your leg to ankle.'),
      f('Rise', 'Waistband to crotch seam', 'From the top of your waistband down to your crotch point. Sit on a hard chair — measure from waist to seat.'),
    ],
  },

  // Alias
  'Salwar / Pyjama / Churidar': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Waist', 'Where waistband sits', 'Around your waist where the waistband will sit.'),
      f('Hip / Seat', 'Fullest hip point', 'Fullest part of hips.'),
      f('Thigh circumference', 'Around fullest thigh', 'Around fullest thigh.'),
      f('Knee circumference', 'Around knee', 'Around knee.'),
      f('Calf circumference', 'Around fullest calf', 'Around fullest calf.'),
      f('Ankle / hem opening', 'Around ankle', 'Around ankle.'),
      f('Inseam length', 'Crotch to ankle (inside leg)', 'Inside leg from crotch to ankle.'),
      f('Outseam length', 'Waistband to ankle (outside leg)', 'Outside leg from waist to ankle.'),
      f('Rise', 'Waistband to crotch seam', 'Waist to crotch.'),
    ],
  },

  // ═══ MEN'S ═══

  'Kurta': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Chest', 'Fullest chest', 'Around fullest chest.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back, shoulder to shoulder.'),
      f('Kurta length', 'Shoulder to desired hem', 'From highest shoulder to desired hem.'),
      f('Sleeve length', 'Shoulder to wrist', 'From shoulder to wrist, arm slightly bent.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole.'),
      f('Wrist circumference', 'Around wrist', 'Around wrist bone.'),
    ],
  },

  'Sherwani': {
    supportsStandard: false, heightRequired: true,
    fields: [
      f('Chest — inhaled', 'Chest at full breath in', 'Measure around fullest chest while breathing in. This ensures enough room.'),
      f('Chest — relaxed', 'Chest at rest', 'Measure around chest while breathing normally, relaxed.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest hips/seat', 'Fullest seat measurement.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Sherwani length', 'Shoulder to desired hem', 'From highest shoulder to desired hem length.'),
      f('Sleeve length', 'Shoulder to wrist', 'Shoulder to wrist, arm slightly bent.'),
      f('Bicep circumference', 'Around fullest bicep', 'Around the fullest part of your upper arm.'),
      f('Wrist circumference', 'Around wrist', 'Around wrist bone.'),
      f('Trouser waist', 'Waist for churidar/trouser', 'Where the trouser waistband sits.'),
      f('Trouser hip / seat', 'Fullest hip for trousers', 'Fullest seat for trouser fit.'),
      f('Thigh circumference', 'Fullest thigh', 'Around fullest thigh.'),
      f('Inseam length', 'Crotch to ankle (inside)', 'Inside leg from crotch to ankle.'),
      f('Outseam length', 'Waist to ankle (outside)', 'Outside leg from waist to ankle.'),
      f('Ankle / churidar hem', 'Around ankle', 'Around ankle bone.'),
    ],
  },

  'Bandhgala': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Chest — inhaled', 'Chest at full breath', 'Fullest chest breathing in.'),
      f('Chest — relaxed', 'Chest at rest', 'Chest relaxed.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest seat', 'Fullest seat.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Jacket length', 'Shoulder to hem', 'Shoulder to desired hem.'),
      f('Sleeve length', 'Shoulder to wrist', 'Shoulder to wrist.'),
      f('Bicep circumference', 'Around fullest bicep', 'Around fullest upper arm.'),
      f('Wrist circumference', 'Around wrist', 'Around wrist bone.'),
    ],
  },

  'Suit/Blazer': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Chest — inhaled', 'Chest at full breath', 'Fullest chest breathing in — for proper jacket ease.'),
      f('Chest — relaxed', 'Chest at rest', 'Chest breathing normally.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest seat', 'Fullest seat.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back, shoulder to shoulder.'),
      f('Jacket length', 'Shoulder to hem', 'Centre back from neckline to desired hem.'),
      f('Sleeve length', 'Shoulder to wrist', 'Shoulder to wrist bone.'),
      f('Bicep circumference', 'Around fullest bicep', 'Around fullest upper arm.'),
      f('Wrist circumference', 'Around wrist', 'Around wrist bone.'),
    ],
  },

  // Alias for old key
  'Suit / Blazer': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Chest — inhaled', 'Chest at full breath', 'Fullest chest breathing in.'),
      f('Chest — relaxed', 'Chest at rest', 'Chest breathing normally.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Hip / Seat', 'Fullest seat', 'Fullest seat.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Jacket length', 'Shoulder to hem', 'Centre back to desired hem.'),
      f('Sleeve length', 'Shoulder to wrist', 'Shoulder to wrist bone.'),
      f('Bicep circumference', 'Around fullest bicep', 'Around fullest upper arm.'),
      f('Wrist circumference', 'Around wrist', 'Around wrist bone.'),
    ],
  },

  'Nehru Jacket': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Chest', 'Fullest chest', 'Around fullest chest.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Jacket length', 'Shoulder to hem', 'Shoulder to desired hem.'),
      f('Armhole circumference', 'Around arm opening', 'Around armhole.'),
    ],
  },

  'Formal Shirt': {
    supportsStandard: true, heightRequired: false,
    fields: [
      f('Chest', 'Fullest chest', 'Around fullest chest over undergarments.'),
      f('Waist', 'Natural waist', 'Natural waist.'),
      f('Shoulder width', 'Shoulder to shoulder', 'Across back.'),
      f('Sleeve length', 'Shoulder to wrist', 'Shoulder to wrist, arm slightly bent.'),
      f('Collar circumference', 'Around base of neck', 'Around the base of your neck. Add 0.5 inch for comfort.'),
      f('Shirt length', 'Back neckline to hem', 'From back neckline to desired shirt length.'),
      f('Wrist circumference', 'Around wrist for cuff', 'Around wrist bone.'),
    ],
  },

  'Trousers': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Waist', 'Where waistband sits', 'Around your waist where the trouser waistband will sit.'),
      f('Hip / Seat', 'Fullest seat (approx 8" below waist)', 'Around the fullest part of your seat, usually 8 inches below the waist.'),
      f('Thigh circumference', 'Around fullest thigh', 'Around the fullest part of your thigh when standing normally.'),
      f('Knee circumference', 'Around knee', 'Around the knee, standing straight.'),
      f('Calf circumference', 'Around fullest calf', 'Around the fullest part of your calf.'),
      f('Ankle / hem opening', 'Desired trouser opening', 'How wide you want the trouser opening at the ankle. Standard trouser: 14–16 inches.'),
      f('Inseam length', 'Crotch to ankle (inside leg)', 'From your crotch seam, down the inside of your leg to your ankle bone.'),
      f('Outseam length', 'Waistband to ankle (outside leg)', 'From the top of the waistband down the outside of your leg to ankle bone.'),
      f('Rise', 'Waistband to crotch seam', 'Sit on a hard flat chair. Measure from waist to the seat surface. This is your rise.'),
    ],
  },

  // Alias for old key
  'Trouser / Chinos / Western Trouser': {
    supportsStandard: false, heightRequired: false,
    fields: [
      f('Waist', 'Where waistband sits', 'Around your waist where the trouser waistband will sit.'),
      f('Hip / Seat', 'Fullest seat', 'Around the fullest part of your seat.'),
      f('Thigh circumference', 'Around fullest thigh', 'Around fullest thigh.'),
      f('Knee circumference', 'Around knee', 'Around knee.'),
      f('Calf circumference', 'Around fullest calf', 'Around fullest calf.'),
      f('Ankle / hem opening', 'Desired opening', 'Desired trouser opening at ankle.'),
      f('Inseam length', 'Crotch to ankle (inside leg)', 'Inside leg from crotch to ankle.'),
      f('Outseam length', 'Waistband to ankle (outside leg)', 'Outside leg from waist to ankle.'),
      f('Rise', 'Waistband to crotch seam', 'Waist to crotch.'),
    ],
  },

  'Veshti / Mundu / Dhoti / Panche': {
    supportsStandard: false, heightRequired: false,
    noStitching: true, noMeasurementNeeded: true,
    noStitchingMessage: "Standard fabric dimensions apply. No body measurements needed. Mention any specific draping style preference in your brief.",
    noMeasurementMessage: "Standard fabric dimensions apply. No body measurements needed.",
    fields: [],
  },

  // Aliases for old wizard keys
  'Veshti / Mundu': {
    supportsStandard: false, heightRequired: false,
    noStitching: true, noMeasurementNeeded: true,
    noStitchingMessage: "Standard fabric dimensions apply. No body measurements needed. Mention any specific draping style preference in your brief.",
    noMeasurementMessage: "Standard fabric dimensions apply. No body measurements needed.",
    fields: [],
  },

  'Dhoti / Panche': {
    supportsStandard: false, heightRequired: false,
    noStitching: true, noMeasurementNeeded: true,
    noStitchingMessage: "Standard fabric dimensions apply. No body measurements needed.",
    noMeasurementMessage: "Standard fabric dimensions apply. No body measurements needed.",
    fields: [],
  },
};

/**
 * Resolve garment config from category + subCategory.
 * Tries subCategory first, then category, then gender-aware fallback.
 */
export const resolveGarmentConfig = (
  category: string,
  subCategory: string,
  gender?: string
): GarmentMeasurementConfig => {
  if (subCategory && MEASUREMENT_CONFIG[subCategory]) return MEASUREMENT_CONFIG[subCategory];
  if (category && MEASUREMENT_CONFIG[category]) return MEASUREMENT_CONFIG[category];
  return gender === 'men' ? MEASUREMENT_CONFIG['Kurta'] : MEASUREMENT_CONFIG['Kurti'];
};

/**
 * Wizard-compatible resolve (no gender param, defaults to Kurti)
 */
export const resolveGarmentMeasurementConfig = (
  category: string,
  subCategory?: string
): GarmentMeasurementConfig => {
  if (subCategory && MEASUREMENT_CONFIG[subCategory]) return MEASUREMENT_CONFIG[subCategory];
  if (category && MEASUREMENT_CONFIG[category]) return MEASUREMENT_CONFIG[category];
  return MEASUREMENT_CONFIG['Kurti'];
};
