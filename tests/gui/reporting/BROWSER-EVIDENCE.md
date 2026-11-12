# Browser window evidence

`page.screenshot()` captures web content only. For submission images showing the
real tab strip/address bar, use unmodified frames from the BrowserStack provider
recording. Never draw or composite a browser toolbar onto an image.

1. Run the selected cases with `CAPTURE_BROWSER_CHROME=1`. The suite captures the
   page before network fixture disposal, brings the test tab to the foreground,
   renders the student watermark and holds it for four seconds.
2. Compile the local macOS Vision OCR helper:

   ```sh
   swiftc -module-cache-path /tmp/hw03-vision-cache tests/gui/reporting/recognize-evidence.swift -o /tmp/hw03-evidence-ocr
   ```
3. Export after the provider session has ended:

   ```sh
   node tests/gui/reporting/export-browser-frames.mjs --run-id RUN_ID --ocr /tmp/hw03-evidence-ocr
   ```

The exporter requires FFmpeg/FFprobe, downloads the provider video to a temporary
folder, checks frames for the configured student email and local URL using OCR,
and copies an unmodified frame to `docs/gui-checklist/cross-platform/browser-evidence/captures/browser-window`.
It saves the verified provider identity, session link, frame time, image hash,
actual URL and OCR text in a manifest. OCR does not prove correct screen state or
native browser chrome; visually review each exported frame before delivery.

Original screenshots and test outcomes remain separate. A recaptured frame is
supplemental evidence from its own run and must retain its own session provenance.

If OCR is unavailable or obstructed by a native OS toast, prepare frames with
`--prepare-only`, visually inspect the exported `GUI-NNN-review.json` frame paths,
then record the selected frame using:

```sh
python3 tests/gui/reporting/approve-browser-frame.py RUN_ID GUI-NNN FRAME_NUMBER
```

Only run the approval command after directly checking the actual frame for the
native toolbar/address bar, the intended page state, and readable student email.
This records a visual inspection, not a human/student review. Frame numbers are
one-based; no image content is modified by the approval command.

Real Android sessions also save a direct device screenshot (`GUI-NNN-native.png`) from the verified AndroidDevice while the watermark is present. Review this whole-device frame before accepting it as canonical evidence.

For a batch that will be reviewed directly, `--candidate-frame` selects a video
frame without depending on OCR. A candidate remains pending until its actual
image has been inspected. Import Android frames with
`python3 tests/gui/reporting/import-device-evidence.py RUN_ID`; unchanged reviewed
frames retain their review records across repeated imports.

After inspection, accept only the listed compliant items:

```sh
python3 tests/gui/reporting/accept-reviewed-evidence.py RUN_ID GUI-001 GUI-002
python3 tests/gui/reporting/link-browser-evidence.py
python3 tests/gui/reporting/refresh-browser-gallery.py
```

The Tab sampler stops on the final observed page control. It does not press an
extra Tab after the last sample, which could move focus to Android Chrome's
native address field. Reject any image showing only the address field and rerun
its case.
An unavailable provider recording or a failed session connection also requires
a new capture; neither counts as an accepted image.

On the mobile admin site and navigation checks, the watermark is placed below
the header and above the lower browser notifications. This keeps identity out
of Chrome's native password-save popup while preserving the tested navigation.
Use `quarantine-device-evidence.py RUN_ID REASON GUI-NNN` to preserve a rejected
frame and its marker under `rejected/`. It does not delete the source or change
any test outcome; a replacement must come from a new run.

The retired `docs/screenshots` directory is backed by a ZIP and SHA-256 inventory
in `screenshot-migration.json`. Only after complete executed-cell coverage and
valid report links may `retire-screenshots.py --delete` remove that directory.
The command validates the archive, every source file and every canonical image
before removal, and refuses unarchived changes.
