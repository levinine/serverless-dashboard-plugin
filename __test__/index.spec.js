const DashboardPlugin = require("..");

describe("Unit tests for DashboardPlugin class", () => {
    it("should create a class", () => {
        const dashboardPlugin = new DashboardPlugin();
        expect(dashboardPlugin.checkForAPI).toBeDefined();
    });
});