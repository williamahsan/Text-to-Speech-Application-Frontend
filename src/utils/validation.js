export const MAX_CHARS = 500;

export const validateTextInput = (text, maxLength = MAX_CHARS) => {
  if (!text || !text.trim()) {
    return {
      isValid: false,
      error: 'Text input cannot be empty or contain only whitespace.',
    };
  }

  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `Text cannot exceed ${maxLength} characters. Current count: ${text.length}.`,
    };
  }

  return { isValid: true, error: '' };
};

export const getMetrics = (text) => {
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  return { wordCount, charCount };
};