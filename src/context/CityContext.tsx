import { createContext, useContext, useState, ReactNode } from 'react';

interface CityContextType {
  selectedCity: string;
  setCity: (city: string) => void;
}

const CityContext = createContext<CityContextType>({
  selectedCity: '',
  setCity: () => {},
});

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('naapio_city') || ''
  );

  const updateCity = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('naapio_city', city);
  };

  return (
    <CityContext.Provider value={{ selectedCity, setCity: updateCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
