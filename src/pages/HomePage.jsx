import React, { useState } from 'react';
import JoinBox from '../components/box-join';


const HomePage = () => {
    return (
        <div>
            <h2>
                HomePage
            </h2>

            <JoinBox joinCode="" error=""/>
        </div>
    );
}

export default HomePage;