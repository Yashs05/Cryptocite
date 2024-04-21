import React from 'react'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Line } from 'react-chartjs-2'

Chart.register(CategoryScale)

export const HomePageChart = ({ currency }) => {
    return (
        <Line
            data={{
                labels: currency.sparkline.map(label => currency.sparkline.indexOf(label)),
                datasets: [{
                    data: currency.sparkline,
                    fill: false,
                    borderColor: currency.change >= 0 ? 'rgba(25, 183, 25, 0.9)' : 'rgba(223, 25, 25, 0.9)',
                    tension: 0.4,
                }]
            }}
            options={{
                // maintainAspectRatio: true,
                responsive: false,
                events: [],
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
            }}
            width='100%'
            height={50} />
    )
}