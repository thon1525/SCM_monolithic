import mongoose from "mongoose";
import MongoDBConnector from "..";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

describe("MongoDBConnector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MongoDBConnector.resetInstance();
  });

  it("should create a singleton instance", () => {
    const instance1 = MongoDBConnector.getInstance();
    const instance2 = MongoDBConnector.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should set up event listeners on initialization", () => {
    MongoDBConnector.getInstance();
    expect(mongoose.connection.on).toHaveBeenCalledWith("connected", expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith("disconnected", expect.any(Function));
  });

  it("should connect to MongoDB", async () => {
    const url = "mongodb://localhost:27017/test";
    await MongoDBConnector.getInstance().connect({ url });
    expect(mongoose.connect).toHaveBeenCalledWith(url);
  });

  it("should handle connection error", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    (mongoose.connect as jest.Mock).mockRejectedValue(new Error("Connection error"));
    
    const url = "mongodb://localhost:27017/test";
    await MongoDBConnector.getInstance().connect({ url });
    
    expect(consoleSpy).toHaveBeenCalledWith("Initial MongoDB connection error", { err: expect.any(Error) });
    consoleSpy.mockRestore();
  });

  it("should disconnect from MongoDB", async () => {
    const instance = MongoDBConnector.getInstance();
    await instance.disconnect();
    expect(mongoose.disconnect).toHaveBeenCalled();
    expect(mongoose.connection.removeAllListeners).toHaveBeenCalled();
  });

  it("should handle disconnection event", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    
    MongoDBConnector.getInstance();
    const disconnectCallback = (mongoose.connection.on as jest.Mock).mock.calls.find(call => call[0] === "disconnected")[1];
    disconnectCallback();

    expect(consoleSpy).toHaveBeenCalledWith("MongoDB disconnected");
    consoleSpy.mockRestore();
  });
});
