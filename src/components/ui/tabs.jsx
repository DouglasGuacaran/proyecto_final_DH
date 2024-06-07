'use client';

import { useState } from 'react';

    const Tabs = ({ tabs, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

    const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    };

return (
    <div>
        <div className="tabs">
            {tabs.map((tab) => (
            <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
            >
                {tab.label}
            </button>
            ))}
        </div>
        <div className="tab-content">
            {tabs.map((tab) => (
            <div
                key={tab.id}
                className={`tab-panel ${activeTab === tab.id ? 'block' : 'hidden'}`}
            >
                {tab.content}
            </div>
            ))}
        </div>
        </div>
    );
};

export default Tabs;
