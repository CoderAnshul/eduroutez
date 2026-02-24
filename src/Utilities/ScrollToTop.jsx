import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // Immediate scroll to top
        window.scrollTo(0, 0);

        // Failsafe for slow loading content / SPA transitions
        const timeoutId = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [pathname, search]);

    return null;
}

export default ScrollToTop