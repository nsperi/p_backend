class FileManager {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async readData() {
        try {
            const data = await fs.readFile(this.fileName, "utf-8");
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async writeData(data) {
        await fs.writeFile(this.fileName, JSON.stringify(data, null, 2));
    }
}