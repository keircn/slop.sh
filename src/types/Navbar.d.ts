export interface NavbarMobileMenuProps {
  isOpen: boolean;
  onLinkClickAction: () => void;
}

export interface NavbarWeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
}

export interface NavbarWeatherProps {
  location?: string;
}

export interface NavbarVariantsProps {
  variants?: Variants;
}

export interface NavbarContextType {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
}
