import React, { useState } from 'react';
import LeftMenuComponent from './LeftMenuComponent';

const BackgroundComponent = ({ children }) => {
    const [reloadNotes, setReloadNotes] = useState(false);

    return (
        <div className='background'>

            <div className='left-menu'>
                <LeftMenuComponent reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} />
            </div>

            {/* <div className='content-background'>
                { children }
            </div> */}

            <div className='content-background'>
                {/* Renderizar el componente children y pasarle los parámetros */}
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { reloadNotes, setReloadNotes });
                    }
                    return child;
                })}
            </div>

        </div>
    );
};

export default BackgroundComponent;