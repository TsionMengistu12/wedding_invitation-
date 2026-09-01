import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { AlertTriangle, Camera, CheckCircle2, Keyboard, LoaderCircle, LogOut, RotateCcw, ScanLine, UserCheck, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { parseInvitationToken } from "../utils/invitationUrl";
import "../styles/GatePage.css";

interface CheckInResult { success: boolean; message: string; guest_name: string | null; guest_limit: number | null; already_checked_in: number; arriving: number; remaining: number; }

export default function GatePage() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanBusyRef = useRef(false);
  const [loading, setLoading] = useState(true); const [authorized, setAuthorized] = useState(false);
  const [scanning, setScanning] = useState(false); const [lookingUp, setLookingUp] = useState(false); const [checkingIn, setCheckingIn] = useState(false);
  const [token, setToken] = useState<string | null>(null); const [manualEntry, setManualEntry] = useState("");
  const [guestName, setGuestName] = useState(""); const [guestLimit, setGuestLimit] = useState<number | null>(null); const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(0); const [arrivingGuests, setArrivingGuests] = useState(1);
  const [result, setResult] = useState<CheckInResult | null>(null); const [error, setError] = useState("");

  useEffect(() => { void checkAccess(); return () => { void stopScanner(); }; }, []);
  async function checkAccess() { const { data: { user } } = await supabase.auth.getUser(); if (!user) { navigate("/login"); return; } const { data: role } = await supabase.rpc("get_my_role"); if (role !== "gate" && role !== "admin") { await supabase.auth.signOut(); navigate("/login"); return; } setAuthorized(true); setLoading(false); }
  async function stopScanner() { const scanner = scannerRef.current; if (!scanner) return; try { if (scanner.getState() === Html5QrcodeScannerState.SCANNING) await scanner.stop(); scanner.clear(); } catch (e) { console.error(e); } finally { scannerRef.current = null; setScanning(false); } }

  async function lookupInvitation(value: string) {
    const invitationToken = parseInvitationToken(value); if (!invitationToken) { setError("Enter a valid invitation link or token."); return; }
    setLookingUp(true); setError(""); setResult(null);
    try {
      const { data: guest, error: guestError } = await supabase.rpc("get_guest_by_token", { token_value: invitationToken }); if (guestError) throw guestError;
      if (!guest?.length) { setError("This invitation was not found. Please try another code."); return; }
      const { data: status, error: statusError } = await supabase.rpc("get_checkin_status", { token_value: invitationToken }); if (statusError) throw statusError;
      if (!status?.length) { setError("Could not retrieve this guest’s check-in status."); return; }
      setToken(invitationToken); setGuestName(guest[0].name); setGuestLimit(guest[0].guest_limit); setAlreadyCheckedIn(status[0].guests_checked_in); setArrivingGuests(1); setManualEntry("");
    } catch (e) { console.error(e); setError("Could not validate this invitation. Check your connection and try again."); } finally { setLookingUp(false); }
  }
  async function startScanner() { setError(""); scanBusyRef.current = false; await stopScanner(); try { const scanner = new Html5Qrcode("qr-reader"); scannerRef.current = scanner; await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 240, height: 240 } }, async text => { if (scanBusyRef.current) return; scanBusyRef.current = true; await stopScanner(); await lookupInvitation(text); }, () => undefined); setScanning(true); } catch (e) { console.error(e); setError("Camera access is unavailable. Allow permission or enter the code manually."); } }
  async function handleManualSubmit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); await lookupInvitation(manualEntry); }
  async function handleCheckIn() { if (!token) return; setCheckingIn(true); setError(""); try { const { data, error: rpcError } = await supabase.rpc("check_in_guest", { token_value: token, arriving_guests: arrivingGuests }); if (rpcError) throw rpcError; if (!data?.length) throw new Error("No check-in response."); const response = data[0] as CheckInResult; setResult(response); setAlreadyCheckedIn(response.already_checked_in + response.arriving); } catch (e) { console.error(e); setError("Could not complete check-in. Please try again."); } finally { setCheckingIn(false); } }
  function reset() { void stopScanner(); setToken(null); setManualEntry(""); setGuestName(""); setGuestLimit(null); setAlreadyCheckedIn(0); setArrivingGuests(1); setResult(null); setError(""); scanBusyRef.current = false; }
  async function logout() { await stopScanner(); await supabase.auth.signOut(); navigate("/login"); }
  if (loading) return <main className="gate-loading">Checking gate access…</main>; if (!authorized) return null;
  const remaining = guestLimit === null ? 0 : Math.max(0, guestLimit - alreadyCheckedIn); const total = result ? result.already_checked_in + result.arriving : alreadyCheckedIn;
  return <main className="gate-page"><header className="gate-header"><div><p>Fevi &amp; Abenezer</p><h1>Guest Check-In</h1></div><button className="gate-logout" onClick={() => void logout()}><LogOut size={15} /> Logout</button></header><div className="gate-shell">
    <div className="gate-progress"><span className={!token ? "is-active" : "is-complete"}>1. Find invitation</span><span className={token && !result ? "is-active" : result ? "is-complete" : ""}>2. Confirm arrival</span><span className={result ? "is-active" : ""}>3. Complete</span></div>
    {error && <div className="gate-alert" role="alert"><AlertTriangle size={19}/><p>{error}</p><button onClick={reset}>Try another code</button></div>}
    {!token && !result && <section className="gate-card"><div className="gate-card-heading"><span className="gate-icon"><ScanLine size={22}/></span><div><p className="gate-eyebrow">Step 1</p><h2>Find an invitation</h2></div></div><p className="gate-intro">Scan the QR code, or paste an invitation link/token when a camera scan is unavailable.</p><div id="qr-reader" className={scanning ? "gate-reader is-visible" : "gate-reader"}/><button className="gate-primary" onClick={() => void startScanner()} disabled={scanning || lookingUp}>{scanning ? <LoaderCircle className="is-spinning" size={17}/> : <Camera size={17}/>} {scanning ? "Camera is scanning…" : "Start QR scanner"}</button>{scanning && <button className="gate-text-button" onClick={() => void stopScanner()}>Stop scanner</button>}<div className="gate-divider"><span/>or enter manually<span/></div><form className="gate-manual-form" onSubmit={e => void handleManualSubmit(e)}><label htmlFor="invitation-code"><Keyboard size={15}/> Invitation link or token</label><div><input id="invitation-code" value={manualEntry} onChange={e => setManualEntry(e.target.value)} placeholder="Paste link or token"/><button disabled={!manualEntry.trim() || lookingUp}>{lookingUp ? "Finding…" : "Find"}</button></div></form></section>}
    {token && guestLimit !== null && !result && <section className="gate-card"><div className="gate-card-heading"><span className="gate-icon"><Users size={22}/></span><div><p className="gate-eyebrow">Invitation found</p><h2>{guestName}</h2></div></div><div className="gate-stats"><div><span>Guest allowance</span><strong>{guestLimit}</strong></div><div><span>Already admitted</span><strong>{alreadyCheckedIn}</strong></div><div className={remaining === 0 ? "is-empty" : ""}><span>Remaining</span><strong>{remaining}</strong></div></div>{remaining === 0 ? <div className="gate-exhausted"><AlertTriangle size={19}/><div><strong>Allowance fully used</strong><p>This invitation has already checked in all allowed guests.</p></div></div> : <><div className="gate-arrival"><h3>How many are arriving now?</h3><div className="gate-count-options">{Array.from({length:remaining},(_,i)=>i+1).map(n=><button key={n} className={arrivingGuests===n?"is-selected":""} onClick={()=>setArrivingGuests(n)}>{n}</button>)}</div></div><button className="gate-primary" onClick={() => void handleCheckIn()} disabled={checkingIn}>{checkingIn ? <LoaderCircle className="is-spinning" size={17}/> : <UserCheck size={17}/>} {checkingIn ? "Checking in…" : `Admit ${arrivingGuests} ${arrivingGuests === 1 ? "person" : "people"}`}</button></>}<button className="gate-text-button" onClick={reset}>Cancel and scan another</button></section>}
    {result && <section className={`gate-card gate-result ${result.success ? "is-success" : "is-rejected"}`}>{result.success ? <CheckCircle2 size={42}/> : <AlertTriangle size={42}/>}<p className="gate-eyebrow">{result.success ? "Admission complete" : "Not admitted"}</p><h2>{result.success ? "Welcome in" : result.message}</h2><p className="gate-result-name">{result.guest_name}</p><p>{result.success ? `${result.arriving} ${result.arriving===1 ? "person was" : "people were"} checked in successfully.` : "The invitation allowance was not changed."}</p>{result.guest_limit !== null && <div className="gate-result-summary"><span>Total admitted <strong>{total} / {result.guest_limit}</strong></span><span>Still available <strong>{result.remaining}</strong></span></div>}<button className="gate-primary" onClick={reset}><RotateCcw size={16}/> Scan next invitation</button></section>}
  </div></main>;
}
