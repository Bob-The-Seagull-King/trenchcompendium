import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'

type LinkProps = {
    link: string;
    children: React.ReactNode;
    runfunc: any;
  };

const CustomNavLink: React.FC<LinkProps> = ({ link, children, runfunc }) => {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          runfunc();
        }
      };
    
      return (
        <a href={link} onClick={handleClick}  rel="noopener noreferrer" style={{textDecoration:"none"}}>
          {children}
        </a>
      );
}

export default CustomNavLink;