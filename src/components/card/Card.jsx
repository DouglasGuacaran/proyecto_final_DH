import React from 'react';

const Card = ({ imageSrc, altText }) => {
    return (
        <div className="card">
            <img src={imageSrc} alt={altText} />
        </div>
    );
};

export default Card;