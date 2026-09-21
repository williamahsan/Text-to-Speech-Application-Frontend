/**
 * Triggers a client-side download of a Base64 audio URI.
 * @param {string} audioUrl - Base64 Data URI (e.g. data:audio/mp3;base64,...)
 * @param {string} filename - Target file name for saving
 */
export const downloadAudioFile = (audioUrl, filename = 'speech.mp3') => {
  if (!audioUrl) return;

  try {
    // 1. Separate metadata from base64 data
    const parts = audioUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'audio/mp3';
    const base64Data = parts[1] || parts[0];

    // 2. Decode Base64 string into binary bytes
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 3. Create a Blob and Object URL
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    // 4. Trigger download via programmatic anchor element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup DOM and release allocated memory
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Failed to trigger audio file download:', error);
  }
};

/**
 * Creates a clean, descriptive default filename based on synthesis details.
 */
export const generateFilename = (voice = 'speech', text = '') => {
  const timestamp = Date.now();
  const slug = text
    .trim()
    .slice(0, 15)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/^_+|_+$/g, '');

  return `${voice}_${slug || 'audio'}_${timestamp}.mp3`;
};