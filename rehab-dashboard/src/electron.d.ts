interface Window {
  electronAPI: {
    startSession: (sessionData: unknown) => Promise<unknown>;
    runBoatExe: () => Promise<{ success: boolean; path?: string }>;
  };
}
