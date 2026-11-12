import AppKit
import Vision
import Foundation
for file in CommandLine.arguments.dropFirst() {
  guard let image = NSImage(contentsOfFile: file), let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let request = VNRecognizeTextRequest()
  request.recognitionLevel = .accurate
  request.usesLanguageCorrection = false
  request.regionOfInterest = CGRect(x: 0, y: 0, width: 1, height: 0.35)
  do {
    try VNImageRequestHandler(cgImage: cg).perform([request])
    let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
    let data = try JSONSerialization.data(withJSONObject: ["path":file,"text":lines.joined(separator:"\n")], options: [.sortedKeys])
    print(String(data:data,encoding:.utf8)!)
  } catch { fputs("OCR failed: \(error)\n",stderr) }
}
