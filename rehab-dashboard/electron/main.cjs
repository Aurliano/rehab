const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const net = require("net");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

// تشخیص درست dev/prod
const isDev = !app.isPackaged;

const backendPort = 5271;
const backendHost = "127.0.0.1";

function resolveBackendPath() {
  const candidates = isDev
    ? [
        path.join(__dirname, "../../Backend/RehabAPI/publish/RehabAPI.exe"),
        path.join(__dirname, "../../Backend/RehabAPI/bin/Release/net8.0/win-x64/publish/RehabAPI.exe"),
        path.join(__dirname, "../../Backend/RehabAPI/bin/Debug/net8.0/RehabAPI.exe")
      ]
    : [path.join(process.resourcesPath, "backend", "RehabAPI.exe")];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function resolveBoatPath() {
  const candidates = isDev
    ? [
        path.join(__dirname, "../boat.exe"),
        path.join(__dirname, "../../Boat/Boat.exe"),
        path.join(__dirname, "../../Backend/RehabAPI/publish/boat.exe"),
        path.join(__dirname, "../../Backend/RehabAPI/bin/Release/net8.0/win-x64/publish/boat.exe"),
      ]
    : [
        path.join(process.resourcesPath, "Boat", "Boat.exe"),
        path.join(process.resourcesPath, "boat.exe"),
        path.join(process.resourcesPath, "backend", "boat.exe"),
      ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(app.getAppPath(), "dist", "index.html");
    console.log("Loading:", indexPath);
    mainWindow.loadFile(indexPath);
    // برای دیباگ:
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

function startBackend() {
  const backendPath = resolveBackendPath();

  if (!backendPath) {
    console.warn("⚠️ Backend executable not found; expecting an already-running API.");
    return;
  }

  console.log("🚀 Starting backend:", backendPath);

  backendProcess = spawn(backendPath, [], {
    cwd: path.dirname(backendPath),
    shell: false,
    env: {
      ...process.env,
      ASPNETCORE_URLS: `http://localhost:${backendPort}`,
      ASPNETCORE_ENVIRONMENT: "Production",
    }
  });

  backendProcess.on("error", (err) => {
    console.error("❌ Backend spawn error:", err);
  });

  backendProcess.stdout?.on("data", (data) => {
    console.log(`[Backend] ${data}`);
  });

  backendProcess.stderr?.on("data", (data) => {
    console.error(`[Backend Error] ${data}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

function waitForBackend(timeoutMs = 20000) {
  const start = Date.now();

  return new Promise((resolve) => {
    const tryConnect = () => {
      const socket = new net.Socket();
      socket.setTimeout(1000);

      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });

      const onFailure = () => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }
        setTimeout(tryConnect, 300);
      };

      socket.once("error", onFailure);
      socket.once("timeout", onFailure);
      socket.connect(backendPort, backendHost);
    };

    tryConnect();
  });
}

app.whenReady().then(async () => {
  ipcMain.handle("run-boat-exe", async () => {
    const boatPath = resolveBoatPath();

    if (!boatPath) {
      throw new Error("Boat.exe not found in expected locations.");
    }

    return new Promise((resolve, reject) => {
      let settled = false;

      const boatProcess = spawn(boatPath, [], {
        cwd: path.dirname(boatPath),
        detached: true,
        stdio: "ignore",
        shell: false,
        windowsHide: false,
      });

      boatProcess.once("error", (err) => {
        if (settled) return;
        settled = true;
        reject(new Error(`Failed to start boat.exe: ${err.message}`));
      });

      boatProcess.once("spawn", () => {
        if (settled) return;
        settled = true;
        boatProcess.unref();
        resolve({ success: true, path: boatPath });
      });
    });
  });

  startBackend();
  const backendReady = await waitForBackend();
  if (!backendReady) {
    dialog.showErrorBox(
      "Backend Not Reachable",
      `Could not connect to backend on http://localhost:${backendPort}. Please run the API service and restart the app.`
    );
  }
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
