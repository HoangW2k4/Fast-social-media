import React, { useState } from 'react';
import './Chart.css';

const LineChart = ({ title, data, chartConfig, options, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        first: options.first.defaultValue,
        second: options.second.defaultValue,
    });

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...selectedFilters,
            [filterType]: value,
        };
        setSelectedFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-options">
                    <select
                        className="chart-select"
                        value={selectedFilters.first}
                        onChange={(e) => handleFilterChange('first', e.target.value)}
                    >
                        {options.first.items.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        className="chart-select"
                        value={selectedFilters.second}
                        onChange={(e) => handleFilterChange('second', e.target.value)}
                    >
                        {options.second.items.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="chart-placeholder" style={{ height: chartConfig.height || 300 }}>
                <div className="chart-mock">
                    <p>📈 Line Chart</p>
                    <p>Data points: {data.length}</p>
                    <p>Filters: {selectedFilters.first}, {selectedFilters.second}</p>
                </div>
            </div>
        </div>
    );
};

const BarChart = ({ title, data, chartConfig, options, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        first: options.first.defaultValue,
        second: options.second.defaultValue,
    });

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...selectedFilters,
            [filterType]: value,
        };
        setSelectedFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-options">
                    <select
                        className="chart-select"
                        value={selectedFilters.first}
                        onChange={(e) => handleFilterChange('first', e.target.value)}
                    >
                        {options.first.items.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        className="chart-select"
                        value={selectedFilters.second}
                        onChange={(e) => handleFilterChange('second', e.target.value)}
                    >
                        {options.second.items.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="chart-placeholder" style={{ height: chartConfig.height || 300 }}>
                <div className="chart-mock">
                    <p>📊 Bar Chart</p>
                    <p>Data points: {data.length}</p>
                    <p>Filters: {selectedFilters.first}, {selectedFilters.second}</p>
                </div>
            </div>
        </div>
    );
};

export { LineChart, BarChart };