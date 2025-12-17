import { app as n, BrowserWindow as i } from "electron";
import { fileURLToPath as c } from "node:url";
import o from "node:path";
const s = o.dirname(c(import.meta.url));
process.env.APP_ROOT = o.join(s, "..");
const r = process.env.VITE_DEV_SERVER_URL, R = o.join(process.env.APP_ROOT, "dist-electron"), l = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = r ? o.join(process.env.APP_ROOT, "public") : l;
let e, t;
function a() {
  t = new i({
    width: 400,
    height: 400,
    transparent: !1,
    frame: !1,
    alwaysOnTop: !0,
    backgroundColor: "#242424",
    webPreferences: {
      nodeIntegration: !1
    }
  }), t.loadFile(o.join(s, "../electron/splash.html")), e = new i({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    show: !1,
    frame: !1,
    // Frameless window
    titleBarStyle: "hidden",
    // Native controls on macOS
    backgroundColor: "#242424",
    webPreferences: {
      preload: o.join(s, "preload.mjs")
    }
  }), e.once("ready-to-show", () => {
    setTimeout(() => {
      t == null || t.close(), t = null, e == null || e.show();
    }, 1500);
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), r ? e.loadURL(r) : e.loadFile(o.join(l, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && a();
});
const d = n.requestSingleInstanceLock();
d ? (n.on("second-instance", (m, f, p) => {
  e && (e.isMinimized() && e.restore(), e.focus());
}), n.whenReady().then(a)) : n.quit();
export {
  R as MAIN_DIST,
  l as RENDERER_DIST,
  r as VITE_DEV_SERVER_URL
};
