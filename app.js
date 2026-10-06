/****************************************************
 * HPD e-TRACKER
 * Frontend Application
 *
 * Ghana Health Service
 * Health Promotion Division
 ****************************************************/

/* ==================================================
   API CONFIGURATION
================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyWBkSveiOsrNd28wFJMyo9kTiWP4htru_4ijdO6mdAkdFp8SqakQGE9l9CzlaCq91ZDg/exec";


/* ==================================================
   GLOBAL DATA
================================================== */

let units = [];
let plans = [];
let tasks = [];
let progressUpdates = [];
let fundingSources = [];

let currentQuarter = "Q1";
let currentUnit = "";


/* ==================================================
   DOM READY
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeApplication();

});


/* ==================================================
   INITIALIZE APPLICATION
================================================== */

async function initializeApplication() {
    try {
        setupLandingPage();
        setupNavigation();
        setupQuarterSelector();
        setupDashboardUnitFilter();
        setupPlanningForm();
        setupProgressForm();
        setupReportButtons();
        await loadAllData();
        renderDashboard();
        renderTaskTable();
        populateUnitSelectors();
        populateTaskSelectors();
    } catch (error) {
        console.error("Application initialization error:", error);
    }
}

/* ==================================================
   LOAD ALL DATA
================================================== */

async function loadAllData() {

    try {

        const [
            unitsResponse,
            plansResponse,
            tasksResponse,
            progressResponse,
            fundingResponse
        ] = await Promise.all([

            fetch(
                API_URL +
                "?action=getUnits"
            ),

            fetch(
                API_URL +
                "?action=getPlans"
            ),

            fetch(
                API_URL +
                "?action=getTasks"
            ),

            fetch(
                API_URL +
                "?action=getProgress"
            ),

            fetch(
                API_URL +
                "?action=getFundingSources"
            )

        ]);


        const unitsData =
            await unitsResponse.json();

        const plansData =
            await plansResponse.json();

        const tasksData =
            await tasksResponse.json();

        const progressData =
            await progressResponse.json();

        const fundingData =
            await fundingResponse.json();


        if (
            unitsData.status ===
            "success"
        ) {

            units =
                unitsData.units || [];

        }


        if (
            plansData.status ===
            "success"
        ) {

            plans =
                plansData.plans || [];

        }


        if (
            tasksData.status ===
            "success"
        ) {

            tasks =
                tasksData.tasks || [];

        }


        if (
            progressData.status ===
            "success"
        ) {

            progressUpdates =
                progressData.updates || [];

        }


        if (
            fundingData.status ===
            "success"
        ) {

            fundingSources =
                fundingData.funding || [];

        }


        console.log(
            "Units loaded:",
            units
        );

        console.log(
            "Plans loaded:",
            plans
        );

        console.log(
            "Tasks loaded:",
            tasks
        );

        console.log(
            "NUMBER OF TASKS LOADED:",
            tasks.length
        );

    }

    catch (error) {

        console.error(
            "Error loading application data:",
            error
        );

    }

}

/* ==================================================
   LANDING PAGE
================================================== */

function setupLandingPage() {

    const landingPage =
        document.getElementById(
            "landingPage"
        );

    const continueButton =
        document.getElementById(
            "continueToTrackerBtn"
        );

    if (!landingPage || !continueButton) {
        return;
    }


    continueButton.addEventListener(
        "click",
        function () {

            landingPage.style.display =
                "none";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}

/* ==================================================
   NAVIGATION
================================================== */

function setupNavigation() {

    const navigationButtons =
        document.querySelectorAll(
            ".nav-btn"
        );


    navigationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const page =
                        button.dataset.page;

                    if (!page) {

                        return;

                    }

                    showPage(page);

                }
            );

        }
    );

}


function showPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );

    pages.forEach(
        function (page) {

            page.classList.remove(
                "active-page"
            );

        }
    );


    const navigationButtons =
        document.querySelectorAll(
            ".nav-btn"
        );

    navigationButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    const selectedPage =
        document.getElementById(
            pageName
        );

    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    const selectedButton =
        document.querySelector(
            '.nav-btn[data-page="' +
            pageName +
            '"]'
        );

    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }

}


/* ==================================================
   QUARTER SELECTOR
================================================== */

function setupQuarterSelector() {

    const quarterSelect =
        document.getElementById(
            "quarter"
        );

    if (!quarterSelect) {
        return;
    }


    quarterSelect.addEventListener(
        "change",
        function () {

            updateQuarterEverywhere(
                quarterSelect.value
            );

        }
    );


    /*
     * Set the initial quarter.
     */
    currentQuarter =
        quarterSelect.value ||
        "2026 Q4";


    /*
     * Synchronize all quarter-related
     * fields immediately.
     */
    updateQuarterEverywhere(
        currentQuarter
    );

}
/* ==================================================
   DASHBOARD UNIT FILTER
================================================== */

function setupDashboardUnitFilter() {

    const dashboardUnit =
        document.getElementById("dashboardUnit");

    if (!dashboardUnit) return;

    dashboardUnit.addEventListener("change", function () {

        renderDashboard();

    });

}

/* ==================================================
   UNIT SELECTORS
================================================== */

function populateUnitSelectors() {

    const selectors = [

        document.getElementById(
            "unit"
        ),

        document.getElementById(
            "dashboardUnit"
        )

    ];


    selectors.forEach(
        function (select) {

            if (!select) {

                return;

            }


            const existingValue =
                select.value;


            /*
             * Keep the first/default option
             * already present in the HTML.
             */

            while (
                select.options.length > 1
            ) {

                select.remove(
                    select.options.length - 1
                );

            }


            units.forEach(
                function (unit) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        unit.Unit_ID || "";

                    option.textContent =
                        unit.Unit_Name || "";

                    select.appendChild(
                        option
                    );

                }
            );


            if (existingValue) {

                select.value =
                    existingValue;

            }

        }
    );

}


/* ==================================================
   FUNDING SELECTOR
================================================== */

function populateFundingSelectors() {

    const fundingSelects =
        document.querySelectorAll(
            'select[name="funding"], .funding-select'
        );


    fundingSelects.forEach(
        function (select) {

            const existingValue =
                select.value;


            while (
                select.options.length > 1
            ) {

                select.remove(
                    select.options.length - 1
                );

            }


            fundingSources.forEach(
                function (funding) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        funding.Funding_Source ||
                        "";

                    option.textContent =
                        funding.Funding_Source ||
                        "";

                    select.appendChild(
                        option
                    );

                }
            );


            if (existingValue) {

                select.value =
                    existingValue;

            }

        }
    );

}


/* ==================================================
   TASK SELECTOR
================================================== */

function populateTaskSelectors() {

    const taskSelect =
        document.getElementById(
            "progressTask"
        );

    if (!taskSelect) {

        return;

    }


    const existingValue =
        taskSelect.value;


    while (
        taskSelect.options.length > 1
    ) {

        taskSelect.remove(
            taskSelect.options.length - 1
        );

    }


    const filteredTasks =
        getFilteredTasks();


    filteredTasks.forEach(
        function (task) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                task.Task_ID || "";

            option.textContent =
                task.Task || "";

            taskSelect.appendChild(
                option
            );

        }
    );


    if (existingValue) {

        taskSelect.value =
            existingValue;

    }

}


/* ==================================================
   FILTER DATA BY QUARTER
================================================== */

function getFilteredPlans() {

    const selectedQuarter =
        String(currentQuarter || "")
            .trim()
            .toUpperCase();

    return plans.filter(function(plan) {

        const planYear =
            String(plan.Year || "").trim();

        let planQuarter =
            String(plan.Quarter || "")
                .trim()
                .toUpperCase();

        if (planQuarter.includes(" ")) {
            planQuarter =
                planQuarter.split(" ").pop();
        }

        if (planQuarter.includes("-")) {
            planQuarter =
                planQuarter.split("-").pop();
        }

        const combinedQuarter =
            planYear + " " + planQuarter;

        return (
            selectedQuarter === planQuarter ||
            selectedQuarter === combinedQuarter
        );

    });
}


function getFilteredTasks() {

    const selectedQuarter =
        String(currentQuarter || "")
            .trim()
            .toUpperCase();

    return tasks.filter(function(task) {

        const taskPlanId =
            String(task.Plan_ID || "").trim();

        // Find the plan connected to this task
        const relatedPlan =
            plans.find(function(plan) {

                return String(plan.Plan_ID || "").trim() ===
                    taskPlanId;

            });

        if (!relatedPlan) {
            return false;
        }

        const planYear =
            String(relatedPlan.Year || "").trim();

        let planQuarter =
            String(relatedPlan.Quarter || "")
                .trim()
                .toUpperCase();

        // Handle values such as:
        // Q4
        // 2026 Q4
        // 2026-Q4
        if (planQuarter.includes(" ")) {
            planQuarter =
                planQuarter.split(" ").pop();
        }

        if (planQuarter.includes("-")) {
            planQuarter =
                planQuarter.split("-").pop();
        }

        const combinedQuarter =
            planYear + " " + planQuarter;

        // Accept either format
        return (
            selectedQuarter === planQuarter ||
            selectedQuarter === combinedQuarter
        );

    });
}

/* ==================================================
   DASHBOARD
================================================== */

function renderDashboard() {

    const dashboardUnit =
        document.getElementById("dashboardUnit");

    const selectedUnit =
        dashboardUnit
            ? String(dashboardUnit.value || "").trim()
            : "";

    const quarterPlans =
        getFilteredPlans();

    const quarterTasks =
        getFilteredTasks();

    let dashboardPlans =
        quarterPlans;

    let dashboardTasks =
        quarterTasks;

    if (selectedUnit) {

        // Find the selected unit
        const selectedUnitObject =
            units.find(function(unit) {

                return String(unit.Unit_ID || "").trim() ===
                    selectedUnit;

            });

        const selectedUnitName =
            selectedUnitObject
                ? String(selectedUnitObject.Unit_Name || "").trim()
                : "";

        // Match either Unit_ID OR Unit_Name
        const unitPlans =
            quarterPlans.filter(function(plan) {

                const planUnit =
                    String(plan.Unit_ID || "").trim();

                return (
                    planUnit === selectedUnit ||
                    planUnit === selectedUnitName
                );

            });

        // Get the plans belonging to this unit
        const planIds =
            new Set();

        unitPlans.forEach(function(plan) {

            const planId =
                String(plan.Plan_ID || "").trim();

            if (planId) {
                planIds.add(planId);
            }

        });

        // Filter tasks through the matching plans
        dashboardTasks =
            quarterTasks.filter(function(task) {

                const taskPlanId =
                    String(task.Plan_ID || "").trim();

                return planIds.has(taskPlanId);

            });

        dashboardPlans =
            unitPlans;
    }

    console.log(
        "Selected unit:",
        selectedUnit
    );

    console.log(
        "Dashboard plans:",
        dashboardPlans
    );

    console.log(
        "Dashboard tasks:",
        dashboardTasks
    );

    updateDashboardNumbers(
        dashboardPlans,
        dashboardTasks
    );

    renderUnitPerformance(
        dashboardTasks
    );

    renderTaskStatus(
        dashboardTasks
    );

    renderUnitPerformanceTable(
        dashboardTasks
    );

    renderTargetActualChart(
        dashboardTasks
    );

    renderYearlyQuarterlyChart();
}

/* ==================================================
   DASHBOARD NUMBERS
================================================== */

function updateDashboardNumbers(
    filteredPlans,
    filteredTasks
) {

    const totalUnitsElement =
        document.getElementById(
            "totalUnits"
        );

    const totalPrioritiesElement =
        document.getElementById(
            "totalPriorities"
        );

    const totalTasksElement =
        document.getElementById(
            "totalTasks"
        );

    const overallAchievementElement =
        document.getElementById(
            "overallAchievement"
        );

    const completedTasksElement =
        document.getElementById(
            "completedTasks"
        );

    const inProgressTasksElement =
        document.getElementById(
            "inProgressTasks"
        );

    const delayedTasksElement =
        document.getElementById(
            "delayedTasks"
        );

    const notStartedTasksElement =
        document.getElementById(
            "notStartedTasks"
        );


    const unitIds =
        new Set();


    filteredPlans.forEach(
        function (plan) {

            if (plan.Unit_ID) {

                unitIds.add(
                    String(
                        plan.Unit_ID
                    )
                );

            }

        }
    );


    filteredTasks.forEach(
        function (task) {

            if (task.Unit_ID) {

                unitIds.add(
                    String(
                        task.Unit_ID
                    )
                );

            }

        }
    );


    const completed =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "completed";

            }
        ).length;


    const inProgress =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "in progress";

            }
        ).length;


    const delayed =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "delayed";

            }
        ).length;


    const notStarted =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "not started";

            }
        ).length;


    let achievementTotal = 0;


    filteredTasks.forEach(
        function (task) {

            achievementTotal +=
                Number(
                    task["Achievement_%"] ||
                    0
                );

        }
    );


    const overallAchievement =
        filteredTasks.length > 0
            ? achievementTotal /
            filteredTasks.length
            : 0;


    if (totalUnitsElement) {

        totalUnitsElement.textContent =
            unitIds.size;

    }


    if (totalPrioritiesElement) {

        totalPrioritiesElement.textContent =
            filteredPlans.length;

    }


    if (totalTasksElement) {

        totalTasksElement.textContent =
            filteredTasks.length;

    }


    if (overallAchievementElement) {

        overallAchievementElement.textContent =
            formatPercentage(
                overallAchievement
            );

    }


    if (completedTasksElement) {

        completedTasksElement.textContent =
            completed;

    }


    if (inProgressTasksElement) {

        inProgressTasksElement.textContent =
            inProgress;

    }


    if (delayedTasksElement) {

        delayedTasksElement.textContent =
            delayed;

    }


    if (notStartedTasksElement) {

        notStartedTasksElement.textContent =
            notStarted;

    }

}


/* ==================================================
   NORMALIZE STATUS
================================================== */

function normalizeStatus(
    status
) {

    return String(
        status || ""
    )
        .trim()
        .toLowerCase();

}


/* ==================================================
   FORMAT PERCENTAGE
================================================== */

function formatPercentage(
    value
) {

    const number =
        Number(value || 0);

    return number.toFixed(1) + "%";

}


/* ==================================================
   UNIT NAME
================================================== */

function getUnitName(
    unitId
) {

    const unit =
        units.find(
            function (item) {

                return String(
                    item.Unit_ID || ""
                ) ===
                    String(
                        unitId || ""
                    );

            }
        );


    if (unit) {

        return unit.Unit_Name || "";

    }


    return unitId || "";

}


/* ==================================================
   UNIT PERFORMANCE
================================================== */

/* ==================================================
   UNIT PERFORMANCE
================================================== */

function renderUnitPerformance(
    filteredTasks
) {

    const container =
        document.getElementById(
            "unitPerformance"
        );

    if (!container) {
        return;
    }


    const performance = {};


    filteredTasks.forEach(
        function (task) {

            const unitId =
                task.Unit_ID || "Unknown";


            if (!performance[unitId]) {

                performance[unitId] = {

                    total: 0,

                    achievement: 0

                };

            }


            performance[unitId].total++;

            performance[unitId].achievement +=
                Number(
                    task["Achievement_%"] ||
                    0
                );

        }
    );


    container.innerHTML = "";


    const unitNames = [];
    const achievementValues = [];


    Object.keys(
        performance
    ).forEach(
        function (unitId) {

            const item =
                performance[unitId];


            const average =
                item.total > 0
                    ? item.achievement /
                    item.total
                    : 0;


            const unitName =
                getUnitName(unitId);


            unitNames.push(unitName);

            achievementValues.push(
                average
            );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "performance-item";


            row.innerHTML = `

                <div class="performance-label">

                    <span>
                        ${escapeHtml(
                unitName
            )}
                    </span>

                    <strong>
                        ${formatPercentage(
                average
            )}
                    </strong>

                </div>


                <div class="performance-bar">

                    <div
                        class="performance-fill"
                        style="width:${Math.min(
                average,
                100
            )}%"
                    ></div>

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );


    /* ==================================================
       UNIT PERFORMANCE CHART
    ================================================== */

    const chartCanvas =
        document.getElementById(
            "unitPerformanceChart"
        );


    if (!chartCanvas) {
        return;
    }


    /*
     * Destroy the previous chart
     * before creating a new one.
     */
    if (
        window.unitPerformanceChartInstance
    ) {

        window.unitPerformanceChartInstance.destroy();

    }


    window.unitPerformanceChartInstance =
        new Chart(
            chartCanvas,
            {

                type: "bar",

                data: {

                    labels:
                        unitNames,

                    datasets: [

                        {

                            label:
                                "Achievement %",

                            data:
                                achievementValues,

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100,

                            ticks: {

                                callback:
                                    function (value) {

                                        return value + "%";

                                    }

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            "Achievement: " +
                                            Number(
                                                context.raw
                                            ).toFixed(1) +
                                            "%"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* ==================================================
   TASK STATUS
================================================== */

function renderTaskStatus(filteredTasks) {

    const container =
        document.getElementById(
            "taskStatus"
        );

    if (!container) {
        return;
    }


    const statuses = {

        "Completed": 0,

        "In Progress": 0,

        "Delayed": 0,

        "Not Started": 0

    };


    filteredTasks.forEach(
        function (task) {

            const status =
                normalizeStatus(
                    task.Status
                );


            if (
                status ===
                "completed"
            ) {

                statuses.Completed++;

            }

            else if (
                status ===
                "in progress"
            ) {

                statuses["In Progress"]++;

            }

            else if (
                status ===
                "delayed"
            ) {

                statuses.Delayed++;

            }

            else {

                statuses["Not Started"]++;

            }

        }
    );


    /* ==========================================
       EXISTING STATUS SUMMARY
    ========================================== */

    container.innerHTML = "";


    Object.keys(
        statuses
    ).forEach(
        function (status) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "status-item";


            item.innerHTML = `

                <span>
                    ${escapeHtml(status)}
                </span>

                <strong>
                    ${statuses[status]}
                </strong>

            `;


            container.appendChild(
                item
            );

        }
    );


    /* ==========================================
       TASK STATUS CHART
    ========================================== */

    const chartCanvas =
        document.getElementById(
            "taskStatusChart"
        );


    if (!chartCanvas) {
        return;
    }


    /* Destroy previous chart
       before creating a new one */

    if (
        window.taskStatusChartInstance
    ) {

        window.taskStatusChartInstance.destroy();

    }


    window.taskStatusChartInstance =
        new Chart(
            chartCanvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Completed",
                        "In Progress",
                        "Delayed",
                        "Not Started"
                    ],

                    datasets: [
                        {

                            data: [
                                statuses.Completed,
                                statuses["In Progress"],
                                statuses.Delayed,
                                statuses["Not Started"]
                            ],

                            borderWidth: 1

                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        const label =
                                            context.label;

                                        const value =
                                            context.raw;

                                        const total =
                                            filteredTasks.length;

                                        const percentage =
                                            total > 0
                                                ? (
                                                    value /
                                                    total *
                                                    100
                                                ).toFixed(1)
                                                : 0;

                                        return (
                                            label +
                                            ": " +
                                            value +
                                            " (" +
                                            percentage +
                                            "%)"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==================================================
   END OF PART 1
================================================== */

/* ==================================================
   UNIT PERFORMANCE TABLE
================================================== */

function renderUnitPerformanceTable(filteredTasks) {

    const tableBody =
        document.getElementById("unitPerformanceTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    const unitStats = {};

    filteredTasks.forEach(function (task) {

        const unitId =
            String(task.Unit_ID || "").trim();

        if (!unitId) return;

        if (!unitStats[unitId]) {

            unitStats[unitId] = {
                unitId: unitId,
                priorities: new Set(),
                tasks: 0,
                target: 0,
                actual: 0
            };

        }

        const stats = unitStats[unitId];

        if (task.Priority) {
            stats.priorities.add(
                String(task.Priority).trim()
            );
        }

        stats.tasks++;

        stats.target +=
            Number(task.Target || 0);

        stats.actual +=
            Number(task.Actual || 0);

    });


    const unitIds =
        Object.keys(unitStats);


    if (unitIds.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No data available for this quarter.
                </td>
            </tr>
        `;

        return;
    }


    unitIds.forEach(function (unitId) {

        const stats =
            unitStats[unitId];

        const unit =
            units.find(function (item) {

                return String(item.Unit_ID || "").trim() ===
                    String(unitId).trim();

            });


        const unitName =
            unit
                ? unit.Unit_Name
                : unitId;


        const achievement =
            stats.target > 0
                ? (stats.actual / stats.target) * 100
                : 0;


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${unitName}</td>

            <td>${stats.priorities.size}</td>

            <td>${stats.tasks}</td>

            <td>${stats.target}</td>
            <td>${stats.actual}</td>

            <td>${formatPercentage(achievement)}</td>
        `;


        tableBody.appendChild(row);

    });

}


/* ==================================================
   TARGET VS ACTUAL CHART
================================================== */

function renderTargetActualChart(filteredTasks) {

    const chartCanvas =
        document.getElementById(
            "targetActualChart"
        );

    if (!chartCanvas) {
        return;
    }


    let totalTarget = 0;
    let totalActual = 0;


    filteredTasks.forEach(function (task) {

        totalTarget +=
            Number(task.Target || 0);

        totalActual +=
            Number(task.Actual || 0);

    });


    /* Destroy previous chart */

    if (
        window.targetActualChartInstance
    ) {

        window.targetActualChartInstance.destroy();

    }


    window.targetActualChartInstance =
        new Chart(
            chartCanvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Quarterly Performance"
                    ],

                    datasets: [

                        {
                            label: "Target",

                            data: [
                                totalTarget
                            ],

                            borderWidth: 1

                        },

                        {
                            label: "Actual",

                            data: [
                                totalActual
                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text: "Value"

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            position: "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            context.raw
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* ==================================================
   YEARLY QUARTERLY PERFORMANCE ANALYSIS
================================================== */

/* ==================================================
   YEARLY QUARTERLY PERFORMANCE ANALYSIS
   UNIT FILTERED
================================================== */

function renderYearlyQuarterlyChart() {

    const chartCanvas =
        document.getElementById(
            "yearlyQuarterlyChart"
        );

    if (!chartCanvas) {
        return;
    }


    /* ==========================================
       GET SELECTED YEAR
    ========================================== */

    const selectedQuarter =
        String(
            currentQuarter || ""
        ).trim();


    const yearMatch =
        selectedQuarter.match(
            /\d{4}/
        );


    const selectedYear =
        yearMatch
            ? yearMatch[0]
            : String(
                new Date().getFullYear()
            );


    /* ==========================================
       GET SELECTED UNIT
    ========================================== */

    const dashboardUnit =
        document.getElementById(
            "dashboardUnit"
        );


    const selectedUnit =
        dashboardUnit
            ? String(
                dashboardUnit.value || ""
            ).trim()
            : "";


    const quarters = [
        "Q1",
        "Q2",
        "Q3",
        "Q4"
    ];


    /* ==========================================
       PREPARE QUARTERLY DATA
    ========================================== */

    const quarterlyData = {

        Q1: {
            target: 0,
            actual: 0
        },

        Q2: {
            target: 0,
            actual: 0
        },

        Q3: {
            target: 0,
            actual: 0
        },

        Q4: {
            target: 0,
            actual: 0
        }

    };


    /* ==========================================
       COLLECT TASK DATA
    ========================================== */

    tasks.forEach(function (task) {

        const taskPlanId =
            String(
                task.Plan_ID || ""
            ).trim();


        const relatedPlan =
            plans.find(function (plan) {

                return String(
                    plan.Plan_ID || ""
                ).trim() ===
                    taskPlanId;

            });


        if (!relatedPlan) {
            return;
        }


        /* Check year */

        const planYear =
            String(
                relatedPlan.Year || ""
            ).trim();


        if (
            planYear !==
            selectedYear
        ) {

            return;

        }


        /* ======================================
           CHECK UNIT
        ====================================== */

        if (selectedUnit) {

            const taskUnitId =
                String(
                    task.Unit_ID || ""
                ).trim();


            const planUnitId =
                String(
                    relatedPlan.Unit_ID || ""
                ).trim();


            const unitId =
                taskUnitId ||
                planUnitId;


            if (
                unitId !==
                selectedUnit
            ) {

                return;

            }

        }


        /* ======================================
           GET QUARTER
        ====================================== */

        let quarter =
            String(
                relatedPlan.Quarter || ""
            ).trim().toUpperCase();


        /* Handle values such as:
           2027 Q1 */

        if (
            quarter.includes(" ")
        ) {

            quarter =
                quarter
                    .split(" ")
                    .pop();

        }


        if (
            !quarterlyData[quarter]
        ) {

            return;

        }


        /* ======================================
           ADD TARGET AND ACTUAL
        ====================================== */

        quarterlyData[
            quarter
        ].target +=
            Number(
                task.Target || 0
            );


        quarterlyData[
            quarter
        ].actual +=
            Number(
                task.Actual || 0
            );

    });


    /* ==========================================
       PREPARE CHART VALUES
    ========================================== */

    const targetValues = [];

    const actualValues = [];

    const achievementValues = [];


    quarters.forEach(
        function (quarter) {

            const data =
                quarterlyData[
                quarter
                ];


            targetValues.push(
                data.target
            );


            actualValues.push(
                data.actual
            );


            const achievement =
                data.target > 0
                    ? (
                        data.actual /
                        data.target
                    ) * 100
                    : 0;


            achievementValues.push(
                achievement
            );

        }
    );


    /* ==========================================
       GET UNIT NAME
    ========================================== */

    let unitTitle =
        "All Units";


    if (selectedUnit) {

        unitTitle =
            getUnitName(
                selectedUnit
            );

    }


    /* ==========================================
       DESTROY PREVIOUS CHART
    ========================================== */

    if (
        window.yearlyQuarterlyChartInstance
    ) {

        window.yearlyQuarterlyChartInstance.destroy();

    }


    /* ==========================================
       CREATE UPDATED CHART
    ========================================== */

    window.yearlyQuarterlyChartInstance =
        new Chart(
            chartCanvas,
            {

                type: "line",

                data: {

                    labels: quarters,

                    datasets: [

                        {
                            label: "Target",

                            data:
                                targetValues,

                            borderWidth: 2,

                            tension: 0.3
                        },

                        {
                            label: "Actual",

                            data:
                                actualValues,

                            borderWidth: 2,

                            tension: 0.3
                        },

                        {
                            label:
                                "Achievement %",

                            data:
                                achievementValues,

                            borderWidth: 2,

                            tension: 0.3
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text:
                                    "Value / Achievement %"

                            }

                        }

                    },

                    plugins: {

                        title: {

                            display: true,

                            text:
                                selectedYear +
                                " Quarterly Performance - " +
                                unitTitle

                        },

                        legend: {

                            position:
                                "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                title:
                                    function (context) {

                                        return (
                                            context[0].label +
                                            " - " +
                                            unitTitle
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}
/* ==================================================
   TASK TABLE
================================================== */

function renderTaskTable() {

    const tableBody =
        document.getElementById(
            "taskTableBody"
        );

    if (!tableBody) {

        return;

    }


    const filteredTasks =
        getFilteredTasks();


    tableBody.innerHTML = "";


    if (
        filteredTasks.length === 0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

      <td
        colspan="8"
        style="text-align:center;"
      >
        No tasks available for
        ${escapeHtml(
            currentQuarter
        )}
      </td>

    `;


        tableBody.appendChild(
            row
        );

        return;

    }


    filteredTasks.forEach(
        function (task) {

            const row =
                document.createElement(
                    "tr"
                );


            const achievement =
                Number(
                    task["Achievement_%"] ||
                    0
                );


            const status =
                task.Status ||
                "Not Started";


            row.innerHTML = `

        <td>
          ${escapeHtml(
                getUnitName(
                    task.Unit_ID
                )
            )}
        </td>

        <td>
          ${escapeHtml(
                task.Priority || ""
            )}
        </td>

        <td>
          ${escapeHtml(
                task.Task || ""
            )}
        </td>

        <td>
          ${formatNumber(
                task.Target
            )}
        </td>

        <td>
          ${formatNumber(
                task.Actual
            )}
        </td>

        <td>
          ${formatPercentage(
                achievement
            )}
        </td>

        <td>
          ${escapeHtml(
                task.Source_of_Funding || ""
            )}
        </td>

        <td>

          <span class="status-badge ${getStatusClass(
                status
            )}">

            ${escapeHtml(
                status
            )}

          </span>

          <button
            type="button"
            class="update-task-btn"
            data-task-id="${escapeHtml(
                task.Task_ID || ""
            )}"
          >
            Update
          </button>

        </td>

      `;


            tableBody.appendChild(
                row
            );

        }
    );


    setupTaskUpdateButtons();

}


/* ==================================================
   NUMBER FORMAT
================================================== */

function formatNumber(
    value
) {

    const number =
        Number(value || 0);


    if (
        Number.isNaN(number)
    ) {

        return "0";

    }


    return number.toLocaleString();

}


/* ==================================================
   STATUS CLASS
================================================== */

function getStatusClass(
    status
) {

    const normalized =
        normalizeStatus(
            status
        );


    if (
        normalized ===
        "completed"
    ) {

        return "status-completed";

    }


    if (
        normalized ===
        "in progress"
    ) {

        return "status-progress";

    }


    if (
        normalized ===
        "delayed"
    ) {

        return "status-delayed";

    }


    return "status-not-started";

}


/* ==================================================
   TASK UPDATE BUTTONS
================================================== */

function setupTaskUpdateButtons() {

    const buttons =
        document.querySelectorAll(
            ".update-task-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const taskId =
                        button.dataset.taskId;


                    openProgressForTask(
                        taskId
                    );

                }
            );

        }
    );

}


/* ==================================================
   OPEN PROGRESS FOR TASK
================================================== */

function openProgressForTask(
    taskId
) {

    const progressTask =
        document.getElementById(
            "progressTask"
        );


    if (progressTask) {

        progressTask.value =
            taskId;

    }


    const taskSection =
        document.getElementById(
            "tasks"
        );


    if (taskSection) {

        taskSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    const progressForm =
        document.getElementById(
            "progressForm"
        );


    if (progressForm) {

        setTimeout(
            function () {

                progressForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            300
        );

    }

}


/* ==================================================
   PLANNING FORM SETUP
================================================== */

function setupPlanningForm() {

    const generateButton =
        document.getElementById(
            "generatePlanningBtn"
        );


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            generatePlanningForm
        );

    }


    const saveButton =
        document.getElementById(
            "saveCompletePlanBtn"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveCompletePlan
        );

    }


    const cancelButton =
        document.getElementById(
            "cancelPlanningBtn"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            cancelPlanning
        );

    }


    const unitSelect =
        document.getElementById(
            "unit"
        );


    if (unitSelect) {

        unitSelect.addEventListener(
            "change",
            function () {

                currentUnit =
                    unitSelect.value;

            }
        );

    }


    const planningQuarter =
        document.getElementById(
            "planningQuarter"
        );


    const topQuarter =
        document.getElementById(
            "quarter"
        );


    if (
        planningQuarter &&
        topQuarter
    ) {

        planningQuarter.value =
            topQuarter.value;

    }

}


/* ==================================================
   GENERATE PLANNING FORM
================================================== */

function generatePlanningForm() {

    const unitSelect =
        document.getElementById(
            "unit"
        );

    const quarterSelect =
        document.getElementById(
            "planningQuarter"
        );

    const priorityCountInput =
        document.getElementById(
            "priorityCount"
        );

    const taskCountInput =
        document.getElementById(
            "taskCount"
        );

    const setupMessage =
        document.getElementById(
            "planningSetupMessage"
        );

    const generatedForm =
        document.getElementById(
            "generatedPlanningForm"
        );

    const priorityContainer =
        document.getElementById(
            "priorityContainer"
        );


    if (!unitSelect) {

        return;

    }


    if (!quarterSelect) {

        return;

    }


    const unitId =
        unitSelect.value;


    const quarter =
        quarterSelect.value;


    const priorityCount =
        Number(
            priorityCountInput
                ? priorityCountInput.value
                : 0
        );


    const taskCount =
        Number(
            taskCountInput
                ? taskCountInput.value
                : 0
        );


    if (!unitId) {

        showFormMessage(
            setupMessage,
            "Please select a unit.",
            "error"
        );

        return;

    }


    if (!quarter) {

        showFormMessage(
            setupMessage,
            "Please select a quarter.",
            "error"
        );

        return;

    }


    if (
        priorityCount < 1
    ) {

        showFormMessage(
            setupMessage,
            "Please enter at least one priority.",
            "error"
        );

        return;

    }


    if (
        taskCount < 1
    ) {

        showFormMessage(
            setupMessage,
            "Please enter at least one task.",
            "error"
        );

        return;

    }


    currentUnit =
        unitId;


    currentQuarter =
        quarter;


    if (priorityContainer) {

        priorityContainer.innerHTML = "";

    }


    /*
     * Create priority blocks.
     */

    for (
        let priorityIndex = 1;
        priorityIndex <= priorityCount;
        priorityIndex++
    ) {

        createPriorityBlock(
            priorityIndex,
            taskCount,
            priorityContainer
        );

    }


    if (generatedForm) {

        generatedForm.style.display =
            "block";

    }


    const summary =
        document.getElementById(
            "planningSummary"
        );


    if (summary) {

        summary.innerHTML = `

      <strong>
        Planning Summary
      </strong>

      <br>

      Unit:
      ${escapeHtml(
            getUnitName(unitId)
        )}

      <br>

      Quarter:
      ${escapeHtml(
            quarter
        )}

      <br>

      Priorities:
      ${priorityCount}

      <br>

      Tasks per priority:
      ${taskCount}

    `;

    }


    showFormMessage(
        setupMessage,
        "Planning form generated successfully.",
        "success"
    );

}


/* ==================================================
   CREATE PRIORITY BLOCK
================================================== */

function createPriorityBlock(
    priorityIndex,
    taskCount,
    container
) {

    if (!container) {
        return;
    }


    const priorityBlock =
        document.createElement(
            "div"
        );


    priorityBlock.className =
        "priority-block";


    priorityBlock.dataset.priorityIndex =
        priorityIndex;


    priorityBlock.innerHTML = `

    <div class="priority-header">

      <h3>
        Priority ${priorityIndex}
      </h3>

    </div>

    <div class="form-group">

      <label>
        Priority Statement
      </label>

      <input
        type="text"
        class="priority-input"
        data-field="priority"
        placeholder="Enter priority"
      >

    </div>

    <div class="form-group">

      <label>
        Objective / Expected Result
      </label>

      <textarea
        class="objective-input"
        data-field="objective"
        placeholder="Enter objective or expected result"
      ></textarea>

    </div>

    <div class="form-group">

      <label>
        Responsible Person
      </label>

      <input
        type="text"
        class="responsible-input"
        data-field="responsible"
        placeholder="Enter responsible person"
      >

    </div>

    <div class="tasks-container">

      <h4>
        Tasks / Activities
      </h4>

      <div class="task-list"></div>

      <button
        type="button"
        class="add-task-btn"
      >
        + Add Task
      </button>

    </div>

  `;


    const tasksContainer =
        priorityBlock.querySelector(
            ".task-list"
        );


    let currentTaskCount = 0;


    for (
        let taskIndex = 1;
        taskIndex <= taskCount;
        taskIndex++
    ) {

        currentTaskCount++;

        createTaskBlock(
            priorityIndex,
            currentTaskCount,
            tasksContainer
        );

    }


    const addTaskButton =
        priorityBlock.querySelector(
            ".add-task-btn"
        );


    if (addTaskButton) {

        addTaskButton.addEventListener(
            "click",
            function () {

                currentTaskCount++;

                createTaskBlock(
                    priorityIndex,
                    currentTaskCount,
                    tasksContainer
                );

            }
        );

    }


    container.appendChild(
        priorityBlock
    );

}

/* ==================================================
   CREATE TASK BLOCK
================================================== */

function createTaskBlock(
    priorityIndex,
    taskIndex,
    container
) {

    if (!container) {
        return;
    }


    const taskBlock =
        document.createElement(
            "div"
        );


    taskBlock.className =
        "task-form-block";


    taskBlock.dataset.taskIndex =
        taskIndex;


    taskBlock.innerHTML = `

    <div class="task-header">

      <h5>
        Task ${priorityIndex}.${taskIndex}
      </h5>

      <button
        type="button"
        class="remove-task-btn"
      >
        Remove Task
      </button>

    </div>


    <div class="form-grid">

      <div class="form-group">

        <label>
          Task / Activity
        </label>

        <textarea
          class="task-input"
          data-field="task"
          placeholder="Enter task or activity"
        ></textarea>

      </div>


      <div class="form-group">

        <label>
          Indicator
        </label>

        <input
          type="text"
          class="indicator-input"
          data-field="indicator"
          placeholder="Enter indicator"
        >

      </div>


      <div class="form-group">

        <label>
          Target
        </label>

        <input
          type="number"
          min="0"
          class="target-input"
          data-field="target"
          placeholder="0"
        >

      </div>


      <div class="form-group">

        <label>
          Actual
        </label>

        <input
          type="number"
          min="0"
          class="actual-input"
          data-field="actual"
          value="0"
          placeholder="0"
        >

      </div>


        <div class="form-group">

  <label>
    Source of Funding
  </label>

  <select
    class="funding-input"
    data-field="funding"
  >

    <option value="">
      Select funding source
    </option>

    ${fundingSources
            .filter(function (source) {
                return String(source.Status || "")
                    .trim()
                    .toLowerCase() !== "inactive";
            })
            .map(function (source) {

                return `
            <option value="${source.Funding_Source}">
              ${source.Funding_Source}
            </option>
          `;

            })
            .join("")
        }

  </select>

</div>


      <div class="form-group">

        <label>
          Responsible Person
        </label>

        <input
          type="text"
          class="task-responsible-input"
          data-field="responsible"
          placeholder="Enter responsible person"
        >

      </div>


      <div class="form-group">

        <label>
          Start Date
        </label>

        <input
          type="date"
          class="start-date-input"
          data-field="startDate"
        >

      </div>


      <div class="form-group">

        <label>
          Due Date
        </label>

        <input
          type="date"
          class="due-date-input"
          data-field="dueDate"
        >

      </div>


      <div class="form-group">

        <label>
          Status
        </label>

        <select
          class="status-input"
          data-field="status"
        >

          <option value="Not Started">
            Not Started
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Delayed">
            Delayed
          </option>

        </select>

      </div>


      <div class="form-group">

        <label>
          Remarks
        </label>

        <textarea
          class="remarks-input"
          data-field="remarks"
          placeholder="Enter remarks"
        ></textarea>

      </div>

    </div>

  `;


    const removeButton =
        taskBlock.querySelector(
            ".remove-task-btn"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function () {

                taskBlock.remove();

            }
        );

    }


    container.appendChild(
        taskBlock
    );

}


/* ==================================================
   FORM MESSAGE
================================================== */

function showFormMessage(
    element,
    message,
    type
) {

    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.className =
        "form-message " +
        (type || "");


    element.style.display =
        "block";

}


/* ==================================================
   CANCEL PLANNING
================================================== */

function cancelPlanning() {

    const generatedForm =
        document.getElementById(
            "generatedPlanningForm"
        );


    const priorityContainer =
        document.getElementById(
            "priorityContainer"
        );


    const setupMessage =
        document.getElementById(
            "planningSetupMessage"
        );


    if (generatedForm) {

        generatedForm.style.display =
            "none";

    }


    if (priorityContainer) {

        priorityContainer.innerHTML =
            "";

    }


    if (setupMessage) {

        setupMessage.textContent =
            "";

        setupMessage.style.display =
            "none";

    }

}


/* ==================================================
   COLLECT PLANNING DATA
================================================== */

function collectPlanningData() {

    const unitSelect =
        document.getElementById(
            "unit"
        );

    const quarterSelect =
        document.getElementById(
            "planningQuarter"
        );


    const unitId =
        unitSelect
            ? unitSelect.value
            : "";


    const quarter =
        quarterSelect
            ? quarterSelect.value
            : "";


    const priorityBlocks =
        document.querySelectorAll(
            ".priority-block"
        );


    const plans =
        [];


    priorityBlocks.forEach(
        function (priorityBlock) {

            const priorityInput =
                priorityBlock.querySelector(
                    ".priority-input"
                );


            const objectiveInput =
                priorityBlock.querySelector(
                    ".objective-input"
                );


            const responsibleInput =
                priorityBlock.querySelector(
                    ".responsible-input"
                );


            const priority =
                priorityInput
                    ? priorityInput.value.trim()
                    : "";


            const objective =
                objectiveInput
                    ? objectiveInput.value.trim()
                    : "";


            const responsible =
                responsibleInput
                    ? responsibleInput.value.trim()
                    : "";


            const taskBlocks =
                priorityBlock.querySelectorAll(
                    ".task-form-block"
                );


            const taskData =
                [];


            taskBlocks.forEach(
                function (taskBlock) {

                    const getValue =
                        function (selector) {

                            const element =
                                taskBlock.querySelector(
                                    selector
                                );

                            return element
                                ? element.value.trim()
                                : "";

                        };


                    taskData.push({

                        task:
                            getValue(
                                ".task-input"
                            ),

                        indicator:
                            getValue(
                                ".indicator-input"
                            ),

                        target:
                            getValue(
                                ".target-input"
                            ),

                        actual:
                            getValue(
                                ".actual-input"
                            ),

                        funding:
                            getValue(
                                ".funding-input"
                            ),

                        responsible:
                            getValue(
                                ".task-responsible-input"
                            ),

                        startDate:
                            getValue(
                                ".start-date-input"
                            ),

                        dueDate:
                            getValue(
                                ".due-date-input"
                            ),

                        status:
                            getValue(
                                ".status-input"
                            ) ||
                            "Not Started",

                        remarks:
                            getValue(
                                ".remarks-input"
                            )

                    });

                }
            );


            plans.push({

                priority:
                    priority,

                objective:
                    objective,

                responsible:
                    responsible,

                tasks:
                    taskData

            });

        }
    );


    return {

        unitId:
            unitId,

        quarter:
            quarter,

        year:
            new Date().getFullYear(),

        plans:
            plans

    };

}


/* ==================================================
   END OF PART 2
================================================== */

/* ==================================================
   SAVE COMPLETE PLAN
================================================== */

async function saveCompletePlan() {

    const messageElement =
        document.getElementById(
            "formMessage"
        );


    const data =
        collectPlanningData();


    /*
     * Basic validation
     */

    if (!data.unitId) {

        showFormMessage(
            messageElement,
            "Please select a unit.",
            "error"
        );

        return;

    }


    if (!data.quarter) {

        showFormMessage(
            messageElement,
            "Please select a quarter.",
            "error"
        );

        return;

    }


    if (
        !data.plans ||
        data.plans.length === 0
    ) {

        showFormMessage(
            messageElement,
            "Please add at least one priority.",
            "error"
        );

        return;

    }


    /*
     * Validate priorities and tasks.
     */

    let validationError =
        "";


    data.plans.forEach(
        function (plan, priorityIndex) {

            if (
                !plan.priority &&
                !validationError
            ) {

                validationError =
                    "Please enter Priority " +
                    (priorityIndex + 1) +
                    ".";

            }


            if (
                !plan.objective &&
                !validationError
            ) {

                validationError =
                    "Please enter the objective for Priority " +
                    (priorityIndex + 1) +
                    ".";

            }


            plan.tasks.forEach(
                function (task, taskIndex) {

                    if (
                        !task.task &&
                        !validationError
                    ) {

                        validationError =
                            "Please enter Task " +
                            (priorityIndex + 1) +
                            "." +
                            (taskIndex + 1) +
                            ".";

                    }


                    if (
                        !task.indicator &&
                        !validationError
                    ) {

                        validationError =
                            "Please enter an indicator for Task " +
                            (priorityIndex + 1) +
                            "." +
                            (taskIndex + 1) +
                            ".";

                    }


                    if (
                        task.target === "" &&
                        !validationError
                    ) {

                        validationError =
                            "Please enter a target for Task " +
                            (priorityIndex + 1) +
                            "." +
                            (taskIndex + 1) +
                            ".";

                    }

                }
            );

        }
    );


    if (validationError) {

        showFormMessage(
            messageElement,
            validationError,
            "error"
        );

        return;

    }


    /*
     * Disable save button while
     * request is being processed.
     */

    const saveButton =
        document.getElementById(
            "saveCompletePlanBtn"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.dataset.originalText =
            saveButton.textContent;

        saveButton.textContent =
            "Saving...";

    }


    showFormMessage(
        messageElement,
        "Saving quarterly plan...",
        "loading"
    );


    try {

        /*
         * The backend accepts one plan
         * with an array of tasks.
         *
         * Because the planning interface
         * allows multiple priorities,
         * each priority is sent as its
         * own quarterly plan record.
         */

        const createdPlans =
            [];


        for (
            let index = 0;
            index < data.plans.length;
            index++
        ) {

            const plan =
                data.plans[index];


            const payload = {

                action:
                    "createQuarterlyPlan",

                year:
                    data.year,

                quarter:
                    data.quarter,

                unitId:
                    data.unitId,

                priority:
                    plan.priority,

                objective:
                    plan.objective,

                responsible:
                    plan.responsible,

                createdBy:
                    "HPD User",

                tasks:
                    plan.tasks

            };


            const response =
                await fetch(
                    API_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            const result =
                await response.json();


            if (
                result.status !==
                "success"
            ) {

                throw new Error(
                    result.message ||
                    "Unable to save Priority " +
                    (index + 1)
                );

            }


            createdPlans.push(
                result
            );

        }


        /*
         * Reload data from Google Sheets
         * after saving.
         */

        await loadAllData();


        renderDashboard();

        renderTaskTable();

        populateTaskSelectors();

        populateUnitSelectors();


        /*
         * Hide generated form.
         */

        const generatedForm =
            document.getElementById(
                "generatedPlanningForm"
            );


        if (generatedForm) {

            generatedForm.style.display =
                "none";

        }


        const priorityContainer =
            document.getElementById(
                "priorityContainer"
            );


        if (priorityContainer) {

            priorityContainer.innerHTML =
                "";

        }


        showFormMessage(
            messageElement,
            "Quarterly plan saved successfully.",
            "success"
        );


        /*
         * Show a short success message
         * before returning to dashboard.
         */

        setTimeout(
            function () {

                showPage(
                    "dashboard"
                );

                renderDashboard();

            },
            1200
        );

    }

    catch (error) {

        console.error(
            "Save plan error:",
            error
        );


        showFormMessage(
            messageElement,
            "Unable to save the plan. " +
            error.message,
            "error"
        );

    }

    finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                saveButton.dataset.originalText ||
                "Save Complete Plan";

        }

    }

}


/* ==================================================
   PROGRESS FORM SETUP
================================================== */

function setupProgressForm() {

    const progressForm =
        document.getElementById(
            "progressForm"
        );

    if (!progressForm) {
        return;
    }


    progressForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await submitProgressUpdate();

        }
    );


    /*
     * Always synchronize the
     * reporting period with the
     * current quarter.
     */
    const reportingPeriod =
        document.getElementById(
            "reportingPeriod"
        );

    if (reportingPeriod) {

        reportingPeriod.value =
            currentQuarter;

    }

}


/* ==================================================
   SUBMIT PROGRESS UPDATE
================================================== */

async function submitProgressUpdate() {

    const taskSelect =
        document.getElementById(
            "progressTask"
        );

    const reportingPeriod =
        document.getElementById(
            "reportingPeriod"
        );

    const actualInput =
        document.getElementById(
            "progressActual"
        );

    const statusSelect =
        document.getElementById(
            "progressStatus"
        );

    const challengesInput =
        document.getElementById(
            "challenges"
        );

    const correctiveActionInput =
        document.getElementById(
            "correctiveAction"
        );

    const messageElement =
        document.getElementById(
            "progressMessage"
        );


    const taskId =
        taskSelect
            ? taskSelect.value
            : "";


    const reportingPeriodValue =
        reportingPeriod
            ? reportingPeriod.value
            : currentQuarter;


    const actual =
        actualInput
            ? Number(
                actualInput.value || 0
            )
            : 0;


    const status =
        statusSelect
            ? statusSelect.value
            : "In Progress";


    const challenges =
        challengesInput
            ? challengesInput.value.trim()
            : "";


    const correctiveAction =
        correctiveActionInput
            ? correctiveActionInput.value.trim()
            : "";


    if (!taskId) {

        showFormMessage(
            messageElement,
            "Please select a task.",
            "error"
        );

        return;

    }


    if (
        actualInput &&
        actualInput.value === ""
    ) {

        showFormMessage(
            messageElement,
            "Please enter the actual achievement.",
            "error"
        );

        return;

    }


    const submitButton =
        document.querySelector(
            '#progressForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.dataset.originalText =
            submitButton.textContent;

        submitButton.textContent =
            "Saving...";

    }


    showFormMessage(
        messageElement,
        "Saving progress update...",
        "loading"
    );


    try {

        const payload = {

            action:
                "createProgressUpdate",

            taskId:
                taskId,

            reportingPeriod:
                reportingPeriodValue,

            actual:
                actual,

            status:
                status,

            challenges:
                challenges,

            correctiveAction:
                correctiveAction,

            updatedBy:
                "HPD User"

        };


        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const result =
            await response.json();


        if (
            result.status !==
            "success"
        ) {

            throw new Error(
                result.message ||
                "Unable to save progress update."
            );

        }


        /*
         * Refresh all data after
         * successful update.
         */

        await loadAllData();


        renderDashboard();

        renderTaskTable();

        populateTaskSelectors();


        showFormMessage(
            messageElement,
            "Progress update saved successfully.",
            "success"
        );


        /*
         * Clear fields after successful
         * submission, but keep the
         * reporting period.
         */

        if (actualInput) {

            actualInput.value =
                "";

        }


        if (challengesInput) {

            challengesInput.value =
                "";

        }


        if (correctiveActionInput) {

            correctiveActionInput.value =
                "";

        }


    }

    catch (error) {

        console.error(
            "Progress update error:",
            error
        );


        showFormMessage(
            messageElement,
            "Unable to save progress update. " +
            error.message,
            "error"
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                submitButton.dataset.originalText ||
                "Save Progress";

        }

    }

}


/* ==================================================
   REPORT BUTTONS
================================================== */

function setupReportButtons() {

    const quarterlyReportButton =
        document.getElementById(
            "quarterlyReportBtn"
        );


    const fundingReportButton =
        document.getElementById(
            "fundingReportBtn"
        );


    if (quarterlyReportButton) {

        quarterlyReportButton.addEventListener(
            "click",
            function () {

                generateQuarterlyReport();

            }
        );

    }


    if (fundingReportButton) {

        fundingReportButton.addEventListener(
            "click",
            function () {

                generateFundingReport();

            }
        );

    }

}


/* ==================================================
   QUARTERLY REPORT
================================================== */

function generateQuarterlyReport() {

    const filteredPlans =
        getFilteredPlans();

    const filteredTasks =
        getFilteredTasks();


    let achievementTotal =
        0;


    filteredTasks.forEach(
        function (task) {

            achievementTotal +=
                Number(
                    task["Achievement_%"] ||
                    0
                );

        }
    );


    const averageAchievement =
        filteredTasks.length > 0
            ? achievementTotal /
            filteredTasks.length
            : 0;


    const completed =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "completed";

            }
        ).length;


    const inProgress =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "in progress";

            }
        ).length;


    const delayed =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "delayed";

            }
        ).length;


    const notStarted =
        filteredTasks.filter(
            function (task) {

                return normalizeStatus(
                    task.Status
                ) ===
                    "not started";

            }
        ).length;


    const reportWindow =
        window.open(
            "",
            "_blank"
        );


    if (!reportWindow) {

        alert(
            "Please allow pop-ups to generate the report."
        );

        return;

    }


    const reportHtml = `

    <!DOCTYPE html>

    <html>

    <head>

      <title>
        HPD Quarterly Performance Report
      </title>

      <style>

        body {

          font-family:
            Arial,
            sans-serif;

          margin:
            40px;

          color:
            #222;

        }

        h1 {

          margin-bottom:
            5px;

        }

        h2 {

          margin-top:
            30px;

        }

        .summary {

          display:
            grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap:
            15px;

          margin:
            25px 0;

        }

        .card {

          border:
            1px solid #ddd;

          padding:
            15px;

          border-radius:
            8px;

        }

        .card strong {

          display:
            block;

          font-size:
            24px;

          margin-top:
            5px;

        }

        table {

          width:
            100%;

          border-collapse:
            collapse;

          margin-top:
            20px;

        }

        th,
        td {

          border:
            1px solid #ddd;

          padding:
            8px;

          text-align:
            left;

        }

        th {

          font-weight:
            bold;

        }

        .print-button {

          margin-bottom:
            20px;

          padding:
            10px 16px;

          cursor:
            pointer;

        }

        @media print {

          .print-button {

            display:
              none;

          }

        }

      </style>

    </head>

    <body>

      <button
        class="print-button"
        onclick="window.print()"
      >
        Print Report
      </button>


      <h1>
        HPD Quarterly Performance Report
      </h1>

      <p>
        Ghana Health Service -
        Health Promotion Division
      </p>

      <p>
        Quarter:
        <strong>
          ${escapeHtml(
        currentQuarter
    )}
        </strong>
      </p>


      <div class="summary">

        <div class="card">

          Plans

          <strong>
            ${filteredPlans.length}
          </strong>

        </div>


        <div class="card">

          Tasks

          <strong>
            ${filteredTasks.length}
          </strong>

        </div>


        <div class="card">

          Achievement

          <strong>
            ${formatPercentage(
        averageAchievement
    )}
          </strong>

        </div>


        <div class="card">

          Completed

          <strong>
            ${completed}
          </strong>

        </div>

      </div>


      <h2>
        Task Status
      </h2>


      <table>

        <thead>

          <tr>

            <th>
              Status
            </th>

            <th>
              Number of Tasks
            </th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>
              Completed
            </td>

            <td>
              ${completed}
            </td>

          </tr>

          <tr>

            <td>
              In Progress
            </td>

            <td>
              ${inProgress}
            </td>

          </tr>

          <tr>

            <td>
              Delayed
            </td>

            <td>
              ${delayed}
            </td>

          </tr>

          <tr>

            <td>
              Not Started
            </td>

            <td>
              ${notStarted}
            </td>

          </tr>

        </tbody>

      </table>


      <h2>
        Task Details
      </h2>


      <table>

        <thead>

          <tr>

            <th>
              Departments
            </th>

            <th>
              Priority
            </th>

            <th>
              Task
            </th>

            <th>
              Target
            </th>

            <th>
              Actual
            </th>

            <th>
              Achievement
            </th>

            <th>
              Funding
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          ${filteredTasks.map(
        function (task) {

            return `

                <tr>

                  <td>
                    ${escapeHtml(
                getUnitName(
                    task.Unit_ID
                )
            )}
                  </td>

                  <td>
                    ${escapeHtml(
                task.Priority || ""
            )}
                  </td>

                  <td>
                    ${escapeHtml(
                task.Task || ""
            )}
                  </td>

                  <td>
                    ${formatNumber(
                task.Target
            )}
                  </td>

                  <td>
                    ${formatNumber(
                task.Actual
            )}
                  </td>

                  <td>
                    ${formatPercentage(
                task["Achievement_%"]
            )}
                  </td>

                  <td>
                    ${escapeHtml(
                task.Source_of_Funding ||
                ""
            )}
                  </td>

                  <td>
                    ${escapeHtml(
                task.Status ||
                ""
            )}
                  </td>

                </tr>

              `;

        }
    ).join("")}

        </tbody>

      </table>


    </body>

    </html>

  `;


    reportWindow.document.open();

    reportWindow.document.write(
        reportHtml
    );

    reportWindow.document.close();

}


/* ==================================================
   END OF PART 3
================================================== */

/* ==================================================
   FUNDING REPORT
================================================== */

function generateFundingReport() {

    const filteredTasks =
        getFilteredTasks();


    const fundingData = {};


    filteredTasks.forEach(
        function (task) {

            const funding =
                task.Source_of_Funding ||
                "Not Specified";


            if (!fundingData[funding]) {

                fundingData[funding] = {

                    tasks: 0,

                    achievement: 0

                };

            }


            fundingData[funding].tasks++;

            fundingData[funding].achievement +=
                Number(
                    task["Achievement_%"] ||
                    0
                );

        }
    );


    const reportWindow =
        window.open(
            "",
            "_blank"
        );


    if (!reportWindow) {

        alert(
            "Please allow pop-ups to generate the report."
        );

        return;

    }


    let fundingRows =
        "";


    Object.keys(
        fundingData
    ).forEach(
        function (funding) {

            const item =
                fundingData[funding];


            const average =
                item.tasks > 0
                    ? item.achievement /
                    item.tasks
                    : 0;


            fundingRows += `

        <tr>

          <td>
            ${escapeHtml(
                funding
            )}
          </td>

          <td>
            ${item.tasks}
          </td>

          <td>
            ${formatPercentage(
                average
            )}
          </td>

        </tr>

      `;

        }
    );


    if (!fundingRows) {

        fundingRows = `

      <tr>

        <td
          colspan="3"
          style="text-align:center;"
        >
          No funding data available
          for ${escapeHtml(
            currentQuarter
        )}
        </td>

      </tr>

    `;

    }


    const reportHtml = `

    <!DOCTYPE html>

    <html>

    <head>

      <title>
        HPD Funding Summary
      </title>

      <style>

        body {

          font-family:
            Arial,
            sans-serif;

          margin:
            40px;

          color:
            #222;

        }

        h1 {

          margin-bottom:
            5px;

        }

        table {

          width:
            100%;

          border-collapse:
            collapse;

          margin-top:
            25px;

        }

        th,
        td {

          border:
            1px solid #ddd;

          padding:
            10px;

          text-align:
            left;

        }

        th {

          font-weight:
            bold;

        }

        .print-button {

          margin-bottom:
            20px;

          padding:
            10px 16px;

          cursor:
            pointer;

        }

        @media print {

          .print-button {

            display:
              none;

          }

        }

      </style>

    </head>

    <body>

      <button
        class="print-button"
        onclick="window.print()"
      >
        Print Report
      </button>


      <h1>
        HPD Funding Summary
      </h1>


      <p>
        Ghana Health Service -
        Health Promotion Division
      </p>


      <p>
        Quarter:
        <strong>
          ${escapeHtml(
        currentQuarter
    )}
        </strong>
      </p>


      <table>

        <thead>

          <tr>

            <th>
              Source of Funding
            </th>

            <th>
              Number of Tasks
            </th>

            <th>
              Average Achievement
            </th>

          </tr>

        </thead>

        <tbody>

          ${fundingRows}

        </tbody>

      </table>


    </body>

    </html>

  `;


    reportWindow.document.open();

    reportWindow.document.write(
        reportHtml
    );

    reportWindow.document.close();

}


/* ==================================================
   PROGRESS FORM HELPERS
================================================== */

function clearProgressForm() {

    const fields = [

        "progressActual",

        "challenges",

        "correctiveAction"

    ];


    fields.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }
    );

}


/* ==================================================
   FIND TASK
================================================== */

function findTaskById(
    taskId
) {

    return tasks.find(
        function (task) {

            return String(
                task.Task_ID || ""
            ) ===
                String(
                    taskId || ""
                );

        }
    );

}


/* ==================================================
   CALCULATE ACHIEVEMENT
================================================== */

function calculateAchievement(
    target,
    actual
) {

    const targetNumber =
        Number(
            target || 0
        );


    const actualNumber =
        Number(
            actual || 0
        );


    if (
        targetNumber <= 0
    ) {

        return 0;

    }


    return (
        actualNumber /
        targetNumber
    ) * 100;

}


/* ==================================================
   AUTO CALCULATE PROGRESS
================================================== */

function setupProgressCalculation() {

    const taskSelect =
        document.getElementById(
            "progressTask"
        );

    const actualInput =
        document.getElementById(
            "progressActual"
        );


    if (
        !taskSelect ||
        !actualInput
    ) {

        return;

    }


    /*
     * This is mainly for future
     * display enhancements.
     *
     * The actual achievement is
     * calculated by the Google
     * Apps Script backend.
     */

    actualInput.addEventListener(
        "input",
        function () {

            const task =
                findTaskById(
                    taskSelect.value
                );


            if (!task) {

                return;

            }


            const achievement =
                calculateAchievement(
                    task.Target,
                    actualInput.value
                );


            actualInput.title =
                "Achievement: " +
                formatPercentage(
                    achievement
                );

        }
    );

}


/* ==================================================
   UPDATE PROGRESS TASK INFORMATION
================================================== */

function setupProgressTaskChange() {

    const taskSelect =
        document.getElementById(
            "progressTask"
        );


    if (!taskSelect) {

        return;

    }


    taskSelect.addEventListener(
        "change",
        function () {

            const task =
                findTaskById(
                    taskSelect.value
                );


            if (!task) {

                return;

            }


            const actualInput =
                document.getElementById(
                    "progressActual"
                );


            const statusSelect =
                document.getElementById(
                    "progressStatus"
                );


            if (actualInput) {

                actualInput.value =
                    task.Actual || "";

            }


            if (statusSelect) {

                statusSelect.value =
                    task.Status ||
                    "In Progress";

            }

        }
    );

}


/* ==================================================
   SETUP ADDITIONAL PROGRESS EVENTS
================================================== */

function initializeProgressHelpers() {

    setupProgressCalculation();

    setupProgressTaskChange();

}


/* ==================================================
   DATE HELPERS
================================================== */

function formatDate(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString();

}


/* ==================================================
   DEADLINE CHECK
================================================== */

function isTaskDelayed(
    task
) {

    if (
        normalizeStatus(
            task.Status
        ) ===
        "completed"
    ) {

        return false;

    }


    if (!task.Due_Date) {

        return false;

    }


    const dueDate =
        new Date(
            task.Due_Date
        );


    if (
        Number.isNaN(
            dueDate.getTime()
        )
    ) {

        return false;

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    dueDate.setHours(
        0,
        0,
        0,
        0
    );


    return dueDate < today;

}


/* ==================================================
   DATA SUMMARY
================================================== */

function getDataSummary() {

    const filteredPlans =
        getFilteredPlans();

    const filteredTasks =
        getFilteredTasks();


    let totalTarget =
        0;

    let totalActual =
        0;


    filteredTasks.forEach(
        function (task) {

            totalTarget +=
                Number(
                    task.Target || 0
                );


            totalActual +=
                Number(
                    task.Actual || 0
                );

        }
    );


    const achievement =
        totalTarget > 0
            ? (
                totalActual /
                totalTarget
            ) * 100
            : 0;


    return {

        quarter:
            currentQuarter,

        plans:
            filteredPlans.length,

        tasks:
            filteredTasks.length,

        target:
            totalTarget,

        actual:
            totalActual,

        achievement:
            achievement

    };

}


/* ==================================================
   REFRESH APPLICATION
================================================== */

async function refreshApplication() {

    try {

        await loadAllData();

        renderDashboard();

        renderTaskTable();

        populateUnitSelectors();

        populateTaskSelectors();

        populateFundingSelectors();

    }

    catch (error) {

        console.error(
            "Refresh error:",
            error
        );

    }

}


/* ==================================================
   WINDOW REFRESH EVENT
================================================== */

window.refreshHPDTracker =
    refreshApplication;


/* ==================================================
   INITIALIZE PROGRESS HELPERS
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeProgressHelpers();

    }
);


/* ==================================================
   QUARTER CHANGE SUPPORT
================================================== */

function updateQuarterEverywhere(
    quarter
) {

    if (!quarter) {

        return;

    }


    currentQuarter =
        quarter;


    const topQuarter =
        document.getElementById(
            "quarter"
        );


    const planningQuarter =
        document.getElementById(
            "planningQuarter"
        );


    const reportingPeriod =
        document.getElementById(
            "reportingPeriod"
        );


    if (
        topQuarter &&
        topQuarter.value !== quarter
    ) {

        topQuarter.value =
            quarter;

    }


    if (
        planningQuarter &&
        planningQuarter.value !== quarter
    ) {

        planningQuarter.value =
            quarter;

    }


    if (
        reportingPeriod &&
        reportingPeriod.value !== quarter
    ) {

        reportingPeriod.value =
            quarter;

    }


    renderDashboard();

    renderTaskTable();

    populateTaskSelectors();

}


/* ==================================================
   PLANNING QUARTER CHANGE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const planningQuarter =
            document.getElementById(
                "planningQuarter"
            );


        if (!planningQuarter) {

            return;

        }


        planningQuarter.addEventListener(
            "change",
            function () {

                updateQuarterEverywhere(
                    planningQuarter.value
                );

            }
        );

    }
);


/* ==================================================
   TOP QUARTER CHANGE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const quarter =
            document.getElementById(
                "quarter"
            );


        if (!quarter) {

            return;

        }


        quarter.addEventListener(
            "change",
            function () {

                updateQuarterEverywhere(
                    quarter.value
                );

            }
        );

    }
);


/* ==================================================
   HANDLE ENTER KEY
================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        /*
         * Prevent accidental form
         * submission when pressing
         * Enter inside ordinary
         * text fields.
         */

        if (
            event.key !==
            "Enter"
        ) {

            return;

        }


        const target =
            event.target;


        if (
            !target ||
            target.tagName !==
            "INPUT"
        ) {

            return;

        }


        if (
            target.type ===
            "text"
        ) {

            /*
             * Allow Enter inside inputs
             * only if the user explicitly
             * needs it later.
             */

            event.preventDefault();

        }

    }
);


/* ==================================================
   CONSOLE STARTUP MESSAGE
================================================== */

console.log(
    "HPD e-Tracker frontend loaded successfully."
);

console.log(
    "API:",
    API_URL
);

console.log(
    "Current quarter:",
    currentQuarter
);


/* ==================================================
   END OF PART 4
================================================== */

/* ==================================================
   GENERAL UTILITY FUNCTIONS
================================================== */

/*
 * Safely get an element value.
 */
function getElementValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {

        return "";

    }

    return element.value || "";

}


/*
 * Safely set an element value.
 */
function setElementValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.value =
        value ?? "";

}


/*
 * Safely set text content.
 */
function setElementText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.textContent =
        value ?? "";

}


/* ==================================================
   DATE DISPLAY
================================================== */

function formatDateForDisplay(
    value
) {

    if (!value) {

        return "—";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* ==================================================
   GET TASK STATUS
================================================== */

function getTaskStatus(
    task
) {

    if (!task) {

        return "Not Started";

    }


    return task.Status ||
        "Not Started";

}


/* ==================================================
   GET TASK ACHIEVEMENT
================================================== */

function getTaskAchievement(
    task
) {

    if (!task) {

        return 0;

    }


    return Number(
        task["Achievement_%"] ||
        0
    );

}


/* ==================================================
   GET TASK TARGET
================================================== */

function getTaskTarget(
    task
) {

    if (!task) {

        return 0;

    }


    return Number(
        task.Target ||
        0
    );

}


/* ==================================================
   GET TASK ACTUAL
================================================== */

function getTaskActual(
    task
) {

    if (!task) {

        return 0;

    }


    return Number(
        task.Actual ||
        0
    );

}


/* ==================================================
   TASK SEARCH
================================================== */

function searchTasks(
    searchTerm
) {

    const term =
        String(
            searchTerm || ""
        )
            .trim()
            .toLowerCase();


    if (!term) {

        return getFilteredTasks();

    }


    return getFilteredTasks()
        .filter(
            function (task) {

                const searchableText = [

                    task.Task,

                    task.Priority,

                    task.Indicator,

                    task.Source_of_Funding,

                    task.Responsible_Person,

                    task.Status,

                    getUnitName(
                        task.Unit_ID
                    )

                ]
                    .join(" ")
                    .toLowerCase();


                return searchableText
                    .includes(term);

            }
        );

}


/* ==================================================
   UNIT FILTER
================================================== */

function filterTasksByUnit(
    unitId
) {

    const filtered =
        getFilteredTasks();


    if (!unitId) {

        return filtered;

    }


    return filtered.filter(
        function (task) {

            return String(
                task.Unit_ID || ""
            ) ===
                String(
                    unitId
                );

        }
    );

}


/* ==================================================
   STATUS FILTER
================================================== */

function filterTasksByStatus(
    status
) {

    const filtered =
        getFilteredTasks();


    if (!status) {

        return filtered;

    }


    return filtered.filter(
        function (task) {

            return normalizeStatus(
                task.Status
            ) ===
                normalizeStatus(
                    status
                );

        }
    );

}


/* ==================================================
   GET UNIT PERFORMANCE
================================================== */

function getUnitPerformanceData(
    filteredTasks
) {

    const result = {};


    filteredTasks.forEach(
        function (task) {

            const unitId =
                task.Unit_ID ||
                "Unknown";


            if (!result[unitId]) {

                result[unitId] = {

                    unitId:
                        unitId,

                    unitName:
                        getUnitName(
                            unitId
                        ),

                    taskCount:
                        0,

                    totalTarget:
                        0,

                    totalActual:
                        0,

                    achievement:
                        0

                };

            }


            result[unitId].taskCount++;

            result[unitId].totalTarget +=
                Number(
                    task.Target || 0
                );

            result[unitId].totalActual +=
                Number(
                    task.Actual || 0
                );

        }
    );


    Object.keys(
        result
    ).forEach(
        function (unitId) {

            const item =
                result[unitId];


            item.achievement =
                item.totalTarget > 0
                    ? (
                        item.totalActual /
                        item.totalTarget
                    ) * 100
                    : 0;

        }
    );


    return result;

}


/* ==================================================
   GET FUNDING PERFORMANCE
================================================== */

function getFundingPerformanceData(
    filteredTasks
) {

    const result = {};


    filteredTasks.forEach(
        function (task) {

            const funding =
                task.Source_of_Funding ||
                "Not Specified";


            if (!result[funding]) {

                result[funding] = {

                    funding:
                        funding,

                    taskCount:
                        0,

                    totalTarget:
                        0,

                    totalActual:
                        0

                };

            }


            result[funding].taskCount++;

            result[funding].totalTarget +=
                Number(
                    task.Target || 0
                );

            result[funding].totalActual +=
                Number(
                    task.Actual || 0
                );

        }
    );


    Object.keys(
        result
    ).forEach(
        function (funding) {

            const item =
                result[funding];


            item.achievement =
                item.totalTarget > 0
                    ? (
                        item.totalActual /
                        item.totalTarget
                    ) * 100
                    : 0;

        }
    );


    return result;

}


/* ==================================================
   EXPORT DATA TO CSV
================================================== */

function exportTasksToCSV() {

    const filteredTasks =
        getFilteredTasks();


    if (
        filteredTasks.length === 0
    ) {

        alert(
            "There are no tasks to export for " +
            currentQuarter +
            "."
        );

        return;

    }


    const headers = [

        "Unit",

        "Priority",

        "Task",

        "Indicator",

        "Target",

        "Actual",

        "Achievement_%",

        "Source_of_Funding",

        "Responsible_Person",

        "Start_Date",

        "Due_Date",

        "Status",

        "Remarks"

    ];


    const rows =
        filteredTasks.map(
            function (task) {

                return [

                    getUnitName(
                        task.Unit_ID
                    ),

                    task.Priority || "",

                    task.Task || "",

                    task.Indicator || "",

                    task.Target || 0,

                    task.Actual || 0,

                    task["Achievement_%"] || 0,

                    task.Source_of_Funding || "",

                    task.Responsible_Person || "",

                    task.Start_Date || "",

                    task.Due_Date || "",

                    task.Status || "",

                    task.Remarks || ""

                ];

            }
        );


    const csvRows = [];


    csvRows.push(
        headers.map(
            csvEscape
        ).join(",")
    );


    rows.forEach(
        function (row) {

            csvRows.push(
                row.map(
                    csvEscape
                ).join(",")
            );

        }
    );


    const csv =
        csvRows.join("\n");


    downloadFile(
        "HPD_eTracker_" +
        currentQuarter +
        ".csv",
        csv,
        "text/csv"
    );

}


/* ==================================================
   CSV ESCAPE
================================================== */

function csvEscape(
    value
) {

    const text =
        String(
            value ?? ""
        );


    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n")
    ) {

        return '"' +
            text.replace(
                /"/g,
                '""'
            ) +
            '"';

    }


    return text;

}


/* ==================================================
   DOWNLOAD FILE
================================================== */

function downloadFile(
    filename,
    content,
    mimeType
) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    mimeType ||
                    "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* ==================================================
   OPTIONAL EXPORT BUTTON SUPPORT
================================================== */

function setupExportButtons() {

    const exportButton =
        document.getElementById(
            "exportTasksBtn"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportTasksToCSV
        );

    }

}


/* ==================================================
   INITIALIZE OPTIONAL FEATURES
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupExportButtons();

    }
);


/* ==================================================
   ERROR HANDLING
================================================== */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "HPD e-Tracker error:",
            event.error ||
            event.message
        );

    }
);


/* ==================================================
   UNHANDLED PROMISE ERRORS
================================================== */

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "HPD e-Tracker promise error:",
            event.reason
        );

    }
);


/* ==================================================
   FINAL APPLICATION CHECK
================================================== */

function applicationHealthCheck() {

    const result = {

        apiConfigured:
            Boolean(
                API_URL
            ),

        unitsLoaded:
            Array.isArray(
                units
            ),

        plansLoaded:
            Array.isArray(
                plans
            ),

        tasksLoaded:
            Array.isArray(
                tasks
            ),

        progressLoaded:
            Array.isArray(
                progressUpdates
            ),

        fundingLoaded:
            Array.isArray(
                fundingSources
            )

    };


    console.table(
        result
    );


    return result;

}


/* ==================================================
   EXPOSE HEALTH CHECK
================================================== */

window.hpdTrackerHealthCheck =
    applicationHealthCheck;


/* ==================================================
   FINAL STARTUP
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTimeout(
            function () {

                applicationHealthCheck();

            },
            1000
        );

    }
);


/* ==================================================
   HPD e-TRACKER READY
================================================== */

console.log(
    "HPD e-Tracker is ready."
);


/* ==================================================
   END OF APP.JS
================================================== */