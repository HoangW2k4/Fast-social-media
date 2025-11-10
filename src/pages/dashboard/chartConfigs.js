export const lineChartConfig = {
    title: 'Lượt xem & thích theo ngày',
    type: 'line',
    options: {
        first: {
            defaultValue: 'month_12_2024',
            items: [
                { label: 'Tháng 12/2024', value: 'month_12_2024' },
                { label: 'Tháng 11/2024', value: 'month_11_2024' },
                { label: 'Tháng 10/2024', value: 'month_10_2024' },
                { label: 'Tháng 9/2024', value: 'month_9_2024' },
                { label: 'Tháng 8/2024', value: 'month_8_2024' },
            ],
        },
        second: {
            defaultValue: '15',
            items: [
                { label: '10 ngày gần nhất', value: '10' },
                { label: '15 ngày gần nhất', value: '15' },
                { label: '30 ngày gần nhất', value: '30' },
            ],
        },
    },
    chartConfig: {
        xAxisKey: 'date',
        lines: [
            { dataKey: 'views', stroke: '#3b82f6', name: 'Lượt xem', strokeWidth: 3 },
            { dataKey: 'likes', stroke: '#ec4899', name: 'Lượt thích', strokeWidth: 3 },
        ],
        height: 350,
    },
};

export const barChartConfig = {
    title: 'Lượt xem theo tháng',
    type: 'bar',
    options: {
        first: {
            defaultValue: '2024',
            items: [
                { label: 'Năm 2024', value: '2024' },
                { label: 'Năm 2023', value: '2023' },
                { label: 'Năm 2022', value: '2022' },
            ],
        },
        second: {
            defaultValue: 'all',
            items: [
                { label: 'Cả năm', value: 'all' },
                { label: 'Quý 1 (T1-T3)', value: 'q1' },
                { label: 'Quý 2 (T4-T6)', value: 'q2' },
                { label: 'Quý 3 (T7-T9)', value: 'q3' },
                { label: 'Quý 4 (T10-T12)', value: 'q4' },
            ],
        },
    },
    chartConfig: {
        xAxisKey: 'month',
        bars: [{ dataKey: 'views', fill: '#8b5cf6', name: 'Lượt xem' }],
        height: 350,
    },
};

// Map để convert filter value sang key trong dataByMonth
export const monthFilterMap = {
    month_12_2024: 'Tháng 12/2024',
    month_11_2024: 'Tháng 11/2024',
    month_10_2024: 'Tháng 10/2024',
    month_9_2024: 'Tháng 9/2024',
    month_8_2024: 'Tháng 8/2024',
};

// Map cho quarter filtering
export const quarterMap = {
    q1: ['T1', 'T2', 'T3'],
    q2: ['T4', 'T5', 'T6'],
    q3: ['T7', 'T8', 'T9'],
    q4: ['T10', 'T11', 'T12'],
};