import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerPage = () => {
    return (
        <div style={{ padding: '20px' }}>
            <SwaggerUI
                url="http://localhost:8080/swagger/doc.json"
                tryItOutEnabled={true}
            />
        </div>
    );
};

export default SwaggerPage;