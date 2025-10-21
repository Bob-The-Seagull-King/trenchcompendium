import React, {useState} from 'react';
import {useCampaign} from "../../../context/CampaignContext";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const dummyWarbandData = [
    {
        name: 'Iron Fangs',
        progress: [
            { round: 1, victoryPoints: 5, ducats: 20, glory: 3 },
            { round: 2, victoryPoints: 12, ducats: 45, glory: 6 },
            { round: 3, victoryPoints: 18, ducats: 60, glory: 10 },
            { round: 4, victoryPoints: 25, ducats: 90, glory: 14 },
            { round: 5, victoryPoints: 32, ducats: 120, glory: 18 },
        ]
    },
    {
        name: 'Ashen Blades',
        progress: [
            { round: 1, victoryPoints: 4, ducats: 18, glory: 2 },
            { round: 2, victoryPoints: 10, ducats: 35, glory: 5 },
            { round: 3, victoryPoints: 16, ducats: 55, glory: 10 },
            { round: 4, victoryPoints: 21, ducats: 75, glory: 18 },
            { round: 5, victoryPoints: 24, ducats: 95, glory: 22 },
        ]
    },
    {
        name: 'Crimson Pact',
        progress: [
            { round: 1, victoryPoints: 7, ducats: 25, glory: 5 },
            { round: 2, victoryPoints: 14, ducats: 50, glory: 10 },
            { round: 3, victoryPoints: 23, ducats: 85, glory: 18 },
            { round: 4, victoryPoints: 33, ducats: 115, glory: 25 },
            { round: 5, victoryPoints: 40, ducats: 140, glory: 30 },
        ]
    },
    {
        name: 'Bone Rats',
        progress: [
            { round: 1, victoryPoints: 2, ducats: 10, glory: 1 },
            { round: 2, victoryPoints: 6, ducats: 25, glory: 4 },
            { round: 3, victoryPoints: 10, ducats: 40, glory: 7 },
            { round: 4, victoryPoints: 15, ducats: 60, glory: 10 },
            { round: 5, victoryPoints: 18, ducats: 75, glory: 12 },
        ]
    },
];


const colors = ['#8884d8', '#82ca9d', '#ff7300', '#d84f9f'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="custom-tooltip-label">{`Round ${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={`item-${index}`}
                       style={{ color: entry.stroke }}
                       className={'legend-item'}
                    >{`${entry.name}: ${entry.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const CMProgressGraph: React.FC = () => {
    const { campaign } = useCampaign();
    const [selectedMetric, setSelectedMetric] = useState<'ducats' | 'victoryPoints' | 'glory'>('ducats');

    const maxRound = Math.max(...dummyWarbandData.flatMap(wb => wb.progress.map(p => p.round)));

    return (
        <div className="CMProgressGraph">
            <div className={'CMProgressGraph-head'}>
                <h3 className={'CMProgressGraph-headline'}>
                    {'Progression'}
                </h3>

                <select
                    className="form-select CMProgressGraph-select"
                    aria-label="Select Graph data to display"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as 'ducats' | 'victoryPoints' | 'glory')}
                >
                    <option value="ducats">Ducats</option>
                    <option value="victoryPoints">Victory Points</option>
                    <option value="glory">Glory</option>
                </select>
            </div>

            <div className={'CMProgressGraph-graph'} style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart>
                        <XAxis
                            dataKey="round"
                            type="number"
                            allowDecimals={false}
                            domain={[1, maxRound]}
                            axisLine={{ stroke: 'currentColor', strokeDasharray: undefined }}
                            tickLine={true}
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis
                            axisLine={{ stroke: 'currentColor', strokeDasharray: undefined }}
                            tickLine={false}
                            tick={{ fill: 'currentColor' }}
                        />
                        <CartesianGrid strokeDasharray="5 5" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {dummyWarbandData.map((warband, index) => (
                            <Line
                                key={warband.name}
                                dataKey={selectedMetric}
                                data={warband.progress}
                                name={warband.name}
                                type="linear"
                                stroke={colors[index % colors.length]}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CMProgressGraph;

