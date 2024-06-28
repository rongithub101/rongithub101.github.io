// Parameters
const params = {
    scene: 1,
    data: null,
};

// Load data and initialize visualization
d3.csv('Grid view.csv').then(data => {
    params.data = data;
    setupScenes();
    updateScene();
});

function setupScenes() {
    // Scene 1: Overview
    const scene1 = d3.select('#scene1');
    scene1.append('svg')
        .append('text')
        .attr('x', 50)
        .attr('y', 50)
        .text('Paddle Data Market Overview')
        .style('font-size', '24px');

    // Scene 2: Trends
    const scene2 = d3.select('#scene2');
    scene2.append('svg')
        .append('text')
        .attr('x', 50)
        .attr('y', 50)
        .text('Key Trends and Statistics')
        .style('font-size', '24px');

    // Scene 3: Detailed Data
    const scene3 = d3.select('#scene3');
    scene3.append('svg')
        .append('text')
        .attr('x', 50)
        .attr('y', 50)
        .text('Detailed Data by Attribute')
        .style('font-size', '24px');

    // Interactive Exploration
    const explore = d3.select('#explore');
    explore.append('svg')
        .append('text')
        .attr('x', 50)
        .attr('y', 50)
        .text('Explore Data Interactively')
        .style('font-size', '24px');

    // Event Listeners for User Interaction
    d3.select('#scene1').on('click', () => { params.scene = 2; updateScene(); });
    d3.select('#scene2').on('click', () => { params.scene = 3; updateScene(); });
    d3.select('#scene3').on('click', () => { params.scene = 4; updateScene(); });
}

function updateScene() {
    // Clear all scenes
    d3.selectAll('.scene').classed('visible', false);
    
    // Display current scene
    d3.select(`#scene${params.scene}`).classed('visible', true);

    if (params.scene === 1) {
        renderOverview();
    } else if (params.scene === 2) {
        renderTrends();
    } else if (params.scene === 3) {
        renderDetails();
    } else if (params.scene === 4) {
        renderExploration();
    }
}

function renderOverview() {
    const svg = d3.select('#scene1 svg');
    svg.selectAll('*').remove();

    svg.append('text')
        .attr('x', 50)
        .attr('y', 100)
        .text('An overview of the paddle market, including trends in price, brand, and types.')
        .style('font-size', '18px');
}

function renderTrends() {
    const svg = d3.select('#scene2 svg');
    svg.selectAll('*').remove();

    svg.append('text')
        .attr('x', 50)
        .attr('y', 100)
        .text('Key Trends in Paddle Market:')
        .style('font-size', '18px');

    const annotations = [
        {
            note: { label: 'Most paddles released in 2024', title: 'Release Year' },
            x: 100, y: 150, dy: 50, dx: 50
        },
        {
            note: { label: 'Popular shapes: Elongated, Hybrid', title: 'Shape' },
            x: 100, y: 250, dy: 50, dx: 50
        }
    ];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    svg.append('g')
        .attr('class', 'annotation-group')
        .call(makeAnnotations);
}

function renderDetails() {
    const svg = d3.select('#scene3 svg');
    svg.selectAll('*').remove();

    svg.append('text')
        .attr('x', 50)
        .attr('y', 100)
        .text('Detailed Data by Attribute:')
        .style('font-size', '18px');

    // Example detailed data visualization
    const data = params.data;
    data.forEach((d, i) => {
        svg.append('text')
            .attr('x', 50)
            .attr('y', 150 + i * 50)
            .text(`Paddle: ${d['Paddle Name']}, Brand: ${d['Brand']}, Price: ${d['Price']}`)
            .style('font-size', '16px');
    });
}

function renderExploration() {
    const svg = d3.select('#explore svg');
    svg.selectAll('*').remove();

    svg.append('text')
        .attr('x', 50)
        .attr('y', 100)
        .text('Explore Data Interactively:')
        .style('font-size', '18px');

    // Add interactive elements like dropdowns, sliders, and charts here
}