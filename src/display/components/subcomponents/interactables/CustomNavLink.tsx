import '../../../../resources/styles/vendor/bootstrap.css'
import React from 'react'

type LinkProps = {
    link: string;
    children: React.ReactNode;
    classes?: string;
    external?: boolean;
    runfunc: any;
  };

const CustomNavLink: React.FC<LinkProps> = ({ link, children, runfunc, classes = '', external = false }) => {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          runfunc();
        }
      };
    
      return (
        <a href={link}
           onClick={handleClick}
           rel={external ? "noopener noreferrer" : undefined}
           className={classes ? classes : undefined}>
          {children}
        </a>
      );
}

export default CustomNavLink;