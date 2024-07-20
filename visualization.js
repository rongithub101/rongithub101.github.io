// Load the data
d3.csv("netflix_cleaned.csv").then(data => {
    // Process the data and create visualizations
    createVisualization(data);
});

function createVisualization(data) {
    const slides = [
        { id: "slide1", title: "Netflix Content Overview", render: renderOverview },
        { id: "slide2", title: "Content Distribution by Type", render: renderTypeDistribution },
        { id: "slide3", title: "Genre Breakdown", render: renderGenreSunburst }
    ];

    let currentSlideIndex = 0;

    function renderSlide(index) {
        const slide = slides[index];
        const container = d3.select("#slide-container");
        container.html(""); // Clear previous content
        container.append("h2").text(slide.title);
        slide.render(container, data);
    }

    renderSlide(currentSlideIndex);

    d3.select("#prev-btn").on("click", () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            renderSlide(currentSlideIndex);
        }
    });

    d3.select("#next-btn").on("click", () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            renderSlide(currentSlideIndex);
        }
    });
}

function renderOverview(container, data) {
    container.append("p").text(`Total number of titles: ${data.length}`);
    
    const yearsExtent = d3.extent(data, d => +d.release_year);
    container.append("p").text(`Release years range: ${yearsExtent[0]} - ${yearsExtent[1]}`);
    
    const uniqueMaturityRatings = [...new Set(data.map(d => d.maturity_rating))];
    container.append("p").text(`Available maturity ratings: ${uniqueMaturityRatings.join(", ")}`);
}

function renderTypeDistribution(container, data) {
    const types = d3.group(data, d => d.type);
    const pieData = Array.from(types, ([key, value]) => ({ type: key, count: value.length }));

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.type))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    svg.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.type));

    svg.selectAll("text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => `${d.data.type}: ${d.data.count}`);
}

function renderGenreSunburst(container, data) {
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const partition = d3.partition()
        .size([2 * Math.PI, radius]);

    const root = d3.hierarchy({ children: processGenreData(data) })
        .sum(d => d.value);

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, root.children.length + 1));

    partition(root);

    svg.selectAll("path")
        .data(root.descendants())
        .enter()
        .append("path")
        .attr("d", d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1))
        .style("fill", d => color(d.data.name))
        .style("opacity", 0.8)
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget).style("opacity", 1);
        })
        .on("mouseout", (event, d) => {
            d3.select(event.currentTarget).style("opacity", 0.8);
        });

    svg.selectAll("text")
        .data(root.descendants().filter(d => d.depth && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03))
        .enter()
        .append("text")
        .attr("transform", d => {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.35em")
        .text(d => d.data.name);
}

function processGenreData(data) {
    const genreCounts = {};
    data.forEach(item => {
        const genres = JSON.parse(item.genre.replace(/'/g, '"'));
        genres.forEach(genre => {
            if (!genreCounts[genre]) {
                genreCounts[genre] = 0;
            }
            genreCounts[genre]++;
        });
    });

    return Object.entries(genreCounts).map(([name, value]) => ({ name, value }));
}