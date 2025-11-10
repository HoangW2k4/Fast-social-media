import React, { useState, useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import classNames from 'classnames/bind';
import styles from './Chart.module.scss';

const cx = classNames.bind(styles);

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

    // Lọc dữ liệu theo quý
    const filteredData = useMemo(() => {
        if (selectedFilters.second === 'all') {
            return data;
        }

        // Lọc theo quý
        const quarterMap = {
            q1: ['T1', 'T2', 'T3'],
            q2: ['T4', 'T5', 'T6'],
            q3: ['T7', 'T8', 'T9'],
            q4: ['T10', 'T11', 'T12'],
        };

        const months = quarterMap[selectedFilters.second];
        return data.filter((item) => months.includes(item.month));
    }, [data, selectedFilters.second]);

    // Tính toán domain cho Y axis
    const getYAxisDomain = () => {
        if (filteredData.length === 0) {
            return { yMin: 0, yMax: 100 };
        }

        const values = filteredData.map((d) => d[chartConfig.bars[0].dataKey]);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        // Padding 20%
        const padding = (maxValue - minValue) * 0.2;
        const yMin = Math.max(0, Math.floor(minValue - padding));
        const yMax = Math.ceil(maxValue + padding);

        return { yMin, yMax };
    };

    const { yMin, yMax } = getYAxisDomain();

    return (
        <React.Fragment>
            <div className={cx('chart-header')}>
                <div className={cx('header-top')}>
                    <h2 className={cx('chart-title')}>{title}</h2>

                    {/* Dropdowns */}
                    <div className={cx('chart-options')}>
                        <select
                            className={cx('select')}
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
                            className={cx('select')}
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
            </div>

            <div className={cx('chart-container')} style={{ height: chartConfig.height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey={chartConfig.xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis
                            domain={[yMin, yMax]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        {chartConfig.bars.map((bar) => (
                            <Bar
                                key={bar.dataKey}
                                dataKey={bar.dataKey}
                                fill={bar.fill}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </React.Fragment>
    );
};

export default BarChart;