/**
 * Security test payloads for negative testing
 */
export const SecurityTestPayloads = {
  SQL_INJECTION: "1' OR '1'='1",
  XSS_ATTEMPT: "<script>alert('xss')</script>",
  PATH_TRAVERSAL: "../../../etc/passwd",
  NULL_BYTE: "1\0",
  UNICODE_OVERFLOW: "￾" + "9".repeat(100),
} as const;
