export const ERRORS = {
  NOT_FOUND:      { status: "404", title: "Page not found",         text: "The page you are looking for doesn't exist or has moved." },
  SERVER_BUSY:    { status: "503", title: "Server busy",            text: "Too many requests right now. Wait a few seconds and try again." },
  TIMEOUT:        { status: "504", title: "Request timed out",      text: "The request took too long to process. Try again with a shorter prompt." },
  INTERNAL_ERROR: { status: "500", title: "Something went wrong",   text: "The server hit an error. Please try again in a moment." },
  NETWORK_ERROR:  { status: "!",   title: "Can't reach the server", text: "Check that the backend is running and your connection is working." },
  default:        { status: "?",   title: "Unexpected error",       text: "Something unexpected happened." },
};