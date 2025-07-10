import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  FileText, 
  Loader2,
  CheckCircle,
  Eye,
  Settings,
  Palette,
  FileDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useExportResume } from "@/hooks/use-api";
interface PdfExporterProps {
  content?: string;
  type?: 'resume' | 'cover_letter';
  onExportComplete?: (exportData: { pdfBase64: string; downloadUrl: string }) => void;
}

const PdfExporter = ({ content = "", type = 'resume', onExportComplete }: PdfExporterProps) => {
  const [exportContent, setExportContent] = useState(content);
  const [exportType, setExportType] = useState<'resume' | 'cover_letter'>(type);
  const [format, setFormat] = useState<'A4' | 'Letter'>('A4');
  const [exportedPdf, setExportedPdf] = useState<{ pdfBase64: string; downloadUrl: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();
  const exportResume = useExportResume();

  const formatOptions = [
    { value: "A4", label: "A4 (210 × 297 mm)" },
    { value: "Letter", label: "Letter (8.5 × 11 in)" },
  ];

  const typeOptions = [
    { value: "resume", label: "Resume" },
    { value: "cover_letter", label: "Cover Letter" },
  ];

  const handleExport = async () => {
    if (!exportContent.trim()) {
      toast({
        title: "Content required",
        description: "Please provide content to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      const blob = await exportResume.mutateAsync({
        content: exportContent,
        type: exportType,
        format: format,
      });

      // Create download link from blob
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);

      // Set exported data for UI feedback
      setExportedPdf({
        pdfBase64: '', // Not needed for blob download
        downloadUrl: url
      });
      onExportComplete?.({ pdfBase64: '', downloadUrl: url });

      toast({
        title: "PDF exported!",
        description: "Your document has been exported successfully.",
      });

    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (exportedPdf?.downloadUrl) {
      const link = document.createElement('a');
      link.href = exportedPdf.downloadUrl;
      link.download = `${exportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewPdf = () => {
    if (exportedPdf?.downloadUrl) {
      window.open(exportedPdf.downloadUrl, '_blank');
    }
  };

  const handleCopyBase64 = async () => {
    if (exportedPdf?.pdfBase64) {
      try {
        await navigator.clipboard.writeText(exportedPdf.pdfBase64);
        toast({
          title: "Copied!",
          description: "PDF base64 data copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy base64 data.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-green-600" />
          <span>PDF Exporter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Content Input */}
          <div className="space-y-2">
            <Label htmlFor="export-content">Document Content</Label>
            <Textarea
              id="export-content"
              placeholder="Paste the content you want to export as PDF..."
              value={exportContent}
              onChange={(e) => setExportContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Export Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-medium">Export Settings</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="type-select">Document Type</Label>
                <Select
                  value={exportType}
                  onValueChange={(value: 'resume' | 'cover_letter') => setExportType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page Format */}
              <div className="space-y-2">
                <Label htmlFor="format-select">Page Format</Label>
                <Select
                  value={format}
                  onValueChange={(value: 'A4' | 'Letter') => setFormat(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isExporting || !exportContent.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>

        {/* Export Results */}
        {exportedPdf && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">PDF Exported</p>
                <p className="text-xs text-green-600">Document ready for download</p>
              </div>
            </div>

            {/* Export Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Export Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-blue-800">Document Type</p>
                    <p className="text-blue-700 capitalize">{exportType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Page Format</p>
                    <p className="text-blue-700">{format}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">File Size</p>
                    <p className="text-blue-700">
                      {exportedPdf.pdfBase64 ? `${Math.round(exportedPdf.pdfBase64.length * 0.75 / 1024)} KB` : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Status</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Ready
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewPdf}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View PDF
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyBase64}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Copy Base64
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfExporter; 