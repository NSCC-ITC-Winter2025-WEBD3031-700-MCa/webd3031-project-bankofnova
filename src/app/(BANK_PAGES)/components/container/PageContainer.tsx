import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from 'react';

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  // Ensures this runs only on the client-side after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically change title only after mount (client-side)
  useEffect(() => {
    if (mounted && title) {
      setCurrentTitle(title);
      document.title = title; // Update the browser tab title
    }
  }, [title, mounted]);

  // Avoid rendering component during SSR, ensuring no NextRouter errors
  if (!mounted) return null;

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{currentTitle}</title>
          <meta name="description" content={description} />
        </Helmet>
        {children}
      </div>
    </HelmetProvider>
  );
};

export default PageContainer;
