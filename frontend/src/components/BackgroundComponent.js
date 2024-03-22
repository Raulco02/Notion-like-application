import React from 'react';
import LeftMenuComponent from './LeftMenuComponent';

const BackgroundComponent = ( {children} ) => {
    
    return (
        <div className='background'>
            
            <div className='left-menu'>
                <LeftMenuComponent />
            </div>

            <div className='content-background'>
                { children }
            </div>
        </div>
    );
};

export default BackgroundComponent;