import React, { useState, useMemo } from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import classNames from 'classnames/bind';
import styles from './Chart.module.scss';

const cx = classNames.bind(styles);

const LineChart = ({ title, data, chartConfig, options, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        first: options.first.defaultValue,
        second: options.second.defaultValue,
    });

    const [visibleLines, setVisibleLines] = useState(
        chartConfig.lines.reduce((acc, line) => {
            acc[line.dataKey] = true;
            return acc;
        }, {}),
    );

    const toggleLine = (dataKey) => {
        setVisibleLines((prev) => ({
            ...prev,
            [dataKey]: !prev[dataKey],
        }));
    };

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

    // Lọc dữ liệu theo số ngày
    const filteredData = useMemo(() => {
        const daysCount = parseInt(selectedFilters.second) || 10;
        return data.slice(-daysCount);
    }, [data, selectedFilters.second]);

    // Tính toán domain cho Y axis (auto scale)
    const getYAxisDomain = () => {
        let allValues = [];

        // Chỉ lấy giá trị từ các đường đang hiển thị
        chartConfig.lines.forEach((line) => {
            if (visibleLines[line.dataKey]) {
                allValues = [...allValues, ...filteredData.map((d) => d[line.dataKey])];
            }
        });

        if (allValues.length === 0) {
            return { yMin: 0, yMax: 100 };
        }

        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

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

                {/* Legend */}
                <div className={cx('legend')}>
                    {chartConfig.lines.map((line) => (
                        <div
                            key={line.dataKey}
                            className={cx('legend-item', { active: visibleLines[line.dataKey] })}
                            onClick={() => toggleLine(line.dataKey)}
                        >
                            <div
                                className={cx('legend-color')}
                                style={{ backgroundColor: line.stroke }}
                            />
                            <span className={cx('legend-text')}>{line.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={cx('chart-container')} style={{ height: chartConfig.height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                        {chartConfig.lines.map((line) => {
                            if (!visibleLines[line.dataKey]) return null;
                            return (
                                <Line
                                    key={line.dataKey}
                                    type="monotone"
                                    dataKey={line.dataKey}
                                    stroke={line.stroke}
                                    strokeWidth={line.strokeWidth}
                                    dot={{ r: 4, fill: line.stroke }}
                                    activeDot={{ r: 6, fill: line.stroke }}
                                />
                            );
                        })}
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>
        </React.Fragment>
    );
};

export default LineChart;