import { useEffect } from 'react';
 
const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - AI-MedLab`;
        } else {
            document.title = 'AI-MedLab';
        }
    }, [title]);

    return null;
};

export default useDocTitle;