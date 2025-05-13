document.getElementById("calculateBtn").addEventListener("click", () => {
    const doorHeight = parseFloat(document.getElementById("doorHeight").value.trim());
    const doorWeight = parseFloat(document.getElementById("doorWeight").value.trim());
    const maxSprings = parseInt(document.getElementById("maxSprings").value);

    if (isNaN(doorHeight) || isNaN(doorWeight) || doorHeight <= 0 || doorWeight <= 0) {
        alert("Please enter valid positive values for both door height and weight.");
        return;
    }

    let cableDrum, multiplierFormula;
    if (doorHeight >= 900 && doorHeight <= 2299) {
        cableDrum = "400-8";
        multiplierFormula = (height) => 76.35 * Math.pow(height, -0.7231);
    } else if (doorHeight >= 2300 && doorHeight <= 3680) {
        cableDrum = "400-12";
        multiplierFormula = (height) => 244.36 * Math.pow(height, -0.873);
    } else if (doorHeight >= 3681 && doorHeight <= 5500) {
        cableDrum = "5250-18";
        multiplierFormula = (height) => 411.34 * Math.pow(height, -0.877);
    } else {
        alert("Door height is outside the supported range (900-5500 mm).");
        return;
    }

    const multiplier = multiplierFormula(doorHeight);
    const doorIPPT = multiplier * 2.2 * doorWeight;
    const springIPPTRequired = doorIPPT - 3;

    const springs = [
        { name: "Alpine Blue 5.6", ippt: 25, maxHgt: 2200, color: "Blue" },
        { name: "Brown 5.6", ippt: 30, maxHgt: 2200, color: "Brown" },
        { name: "Desert Sand 6.0", ippt: 35, maxHgt: 2200, color: "Sand" },
        { name: "Red 7.1", ippt: 60, maxHgt: 2230, color: "Red" },
        { name: "Lichen 5.6", ippt: 27, maxHgt: 2400, color: "Green" },
        { name: "Black 6.3", ippt: 40, maxHgt: 2400, color: "Black" },
        { name: "Purple 6.3", ippt: 35, maxHgt: 2700, color: "Purple" },
        { name: "Green 7.1", ippt: 50, maxHgt: 2700, color: "Green" },
        { name: "Orange 5.6", ippt: 22, maxHgt: 3000, color: "Orange" },
        { name: "Yellow 6.0", ippt: 27, maxHgt: 3000, color: "Yellow" },
        { name: "Blue 5.0", ippt: 14.5, maxHgt: 3250, color: "Blue" }
    ];

    const generateCombinations = (arr, n, prefix = []) => {
        if (n === 0) {
            const totalIPPT = prefix.reduce((sum, spring) => sum + spring.ippt, 0);
            const allValid = prefix.every(spring => spring.maxHgt >= doorHeight);
            if (allValid && totalIPPT >= springIPPTRequired) {
                validConfigurations.push({
                    name: prefix.map(spring => spring.name).join(" + "),
                    type: `${prefix.length} Spring Combination`,
                    springIPPT: totalIPPT.toFixed(2),
                    color: prefix.map(spring => spring.color).join(", "),
                    ipptDifference: Math.abs(totalIPPT - springIPPTRequired)
                });
            }
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            generateCombinations(arr.slice(i + 1), n - 1, [...prefix, arr[i]]);
        }
    };

    const validConfigurations = [];
    for (let i = 1; i <= maxSprings; i++) {
        generateCombinations(springs, i);
    }

    validConfigurations.sort((a, b) => 
        a.ipptDifference - b.ipptDifference || a.type.length - b.type.length
    );

    const resultsDiv = document.getElementById("results");
    if (validConfigurations.length === 0) {
        resultsDiv.innerHTML = "<p>No valid spring combinations found for the given inputs.</p>";
        return;
    }

    let resultsHTML = `
        <p><strong>Cable Drum:</strong> ${cableDrum}</p>
        <p><strong>Multiplier:</strong> ${multiplier.toFixed(4)}</p>
        <p><strong>Door IPPT:</strong> ${doorIPPT.toFixed(2)}</p>
        <p><strong>Spring IPPT Required:</strong> ${springIPPTRequired.toFixed(2)}</p>
        <table>
            <thead>
                <tr>
                    <th>Spring Name</th>
                    <th>Type</th>
                    <th>Spring IPPT</th>
                    <th>Color</th>
                </tr>
            </thead>
            <tbody>
    `;
    validConfigurations.forEach(config => {
        resultsHTML += `
            <tr>
                <td>${config.name}</td>
                <td>${config.type}</td>
                <td>${config.springIPPT}</td>
                <td>${config.color}</td>
            </tr>
        `;
    });
    resultsHTML += `
            </tbody>
        </table>
    `;
    resultsDiv.innerHTML = resultsHTML;
});
