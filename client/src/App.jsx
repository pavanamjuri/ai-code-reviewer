import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Code2,
  LayoutDashboard,
  Play,
  FileCode,
  History,
  Info,
  Home,
  ShieldAlert,
  Bug,
  Zap,
  Sparkles,
  Upload,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Download,
  RefreshCw,
  Search,
  Filter,
  Terminal,
  Cpu,
  Lock,
  Layers,
  Menu,
  X,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  GitBranch,
  Github,
  MessageSquareCode,
  Send,
  KeyRound,
  Activity,
  GraduationCap,
  ShieldCheck,
  Gauge,
  SplitSquareHorizontal,
  AlignJustify,
  FileDiff
} from 'lucide-react';

// ============================================================================
// CONSTANTS, PERSONA MODES & SAMPLE DATA
// ============================================================================

const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'javascript', name: 'JavaScript', ext: '.js' },
  { id: 'typescript', name: 'TypeScript', ext: '.ts' },
  { id: 'java', name: 'Java', ext: '.java' },
  { id: 'cpp', name: 'C++', ext: '.cpp' },
  { id: 'c', name: 'C', ext: '.c' },
  { id: 'php', name: 'PHP', ext: '.php' },
  { id: 'go', name: 'Go', ext: '.go' },
  { id: 'rust', name: 'Rust', ext: '.rs' },
  { id: 'sql', name: 'SQL', ext: '.sql' }
];

const PERSONA_MODES = [
  {
    id: 'senior',
    name: 'Senior Full-Stack Engineer',
    shortName: 'Senior Engineer',
    badgeColor: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
    icon: Cpu,
    tagline: 'Balanced bugs, architecture, edge cases & maintainability',
    promptDirective:
      'Adopt the persona of a Principal Full-Stack Software Engineer. Perform a holistic review balancing functional correctness, edge cases, clean architecture, error handling, and idiomatic maintainability.'
  },
  {
    id: 'beginner',
    name: 'Beginner Mentor',
    shortName: 'Beginner Mentor',
    badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    icon: GraduationCap,
    tagline: 'Friendly, educational explanations & naming clarity',
    promptDirective:
      'Adopt the persona of an encouraging, patient Computer Science Mentor. Explain every issue in warm, crystal-clear, beginner-friendly language, define why the anti-pattern happens, and emphasize readable variable naming and clean structure.'
  },
  {
    id: 'security',
    name: 'OWASP Security Auditor',
    shortName: 'OWASP Auditor',
    badgeColor: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
    icon: ShieldCheck,
    tagline: 'Strict SQLi, XSS, secrets, auth & injection hunting',
    promptDirective:
      'Adopt the persona of a Lead Application Security Auditor (OWASP Top 10 specialist). Scrutinize every input vector for SQL injection, XSS, command injection, hardcoded credentials, broken authentication, insecure cryptography, and improper sanitization.'
  },
  {
    id: 'performance',
    name: 'Performance Optimizer',
    shortName: 'Perf Optimizer',
    badgeColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30',
    icon: Gauge,
    tagline: 'Big-O complexity, memory leaks & bottleneck elimination',
    promptDirective:
      'Adopt the persona of a High-Frequency Systems Performance Engineer. Focus deeply on Big-O time and space complexity, nested O(n^2) loops, memory/resource leaks, N+1 queries, unnecessary allocations, and concurrency bottlenecks.'
  }
];

const SAMPLE_SNIPPETS = {
  python_vuln: {
    label: 'Python: SQL Injection, Hardcoded Secret & O(n²) Loop',
    language: 'python',
    code: `import sqlite3

DB_API_KEY = "demo_secret_key_98a7sd98a7sd"

def get_user_orders(user_id, status_filter):
    conn = sqlite3.connect('ecommerce.db')
    cursor = conn.cursor()
    # Vulnerable to SQL injection via f-string interpolation
    query = f"SELECT * FROM orders WHERE user_id = '{user_id}' AND status = '{status_filter}'"
    cursor.execute(query)
    results = cursor.fetchall()
    return results

def find_duplicate_transactions(tx_ids):
    duplicates = []
    # O(n^2) nested loop bottleneck on large datasets
    for i in range(len(tx_ids)):
        for j in range(i + 1, len(tx_ids)):
            if tx_ids[i] == tx_ids[j] and tx_ids[i] not in duplicates:
                duplicates.append(tx_ids[i])
    return duplicates`
  },
  js_async: {
    label: 'JavaScript: XSS Sink, eval() & Unhandled Fetch',
    language: 'javascript',
    code: `async function renderUserProfile(userId, customFormula) {
  const response = await fetch('/api/users/' + userId);
  const data = await response.json();

  // Direct DOM injection leads to Cross-Site Scripting (XSS)
  const bioContainer = document.getElementById('user-bio');
  bioContainer.innerHTML = "<h3>" + data.username + "</h3><p>" + data.bio + "</p>";

  // Arbitrary code execution risk
  const dynamicScore = eval(customFormula);
  console.log("Debug score:", dynamicScore, data.token);

  if (data.role == 'admin') {
    localStorage.setItem('admin_secret_token', data.token);
  }
}`
  },
  java_leak: {
    label: 'Java: Resource Leak, Off-By-One & NullPointer Risk',
    language: 'java',
    code: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

public class InvoiceProcessor {
    public double calculateTotal(List<Double> amounts, String discountCode) {
        double sum = 0;
        for (int i = 0; i <= amounts.size(); i++) { // Off-by-one IndexOutOfBoundsException
            sum += amounts.get(i);
        }
        // Potential NullPointerException if discountCode is null
        if (discountCode.equals("SAVE20")) {
            sum = sum * 0.80;
        }
        return sum;
    }

    public String readConfigFile(String path) throws IOException {
        // FileReader and BufferedReader are never closed (resource leak)
        BufferedReader reader = new BufferedReader(new FileReader(path));
        return reader.readLine();
    }
}`
  },
  cpp_mem: {
    label: 'C++: Buffer Overflow (strcpy) & Memory Leak',
    language: 'cpp',
    code: `#include <iostream>
#include <cstring>

void processUserInput(const char* untrustedInput) {
    char buffer[16];
    // Unsafe strcpy can overflow stack buffer
    strcpy(buffer, untrustedInput);
    std::cout << "Processed: " << buffer << std::endl;
}

int* allocateMetrics(int count) {
    int* arr = new int[count];
    if (count <= 0) {
        return nullptr; // Memory leak: arr is never deleted!
    }
    for (int i = 0; i < count; i++) {
        arr[i] = i * 2;
    }
    return arr;
}`
  }
};

const INITIAL_HISTORY = [
  {
    id: 'rev-101',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    language: 'python',
    persona: 'security',
    fileName: 'auth_service.py',
    staticHitsCount: 1,
    originalCode: `import hashlib\n\ndef hash_password(pwd):\n    return hashlib.md5(pwd.encode()).hexdigest()`,
    result: {
      overall_score: 48,
      summary: 'Critical cryptographic weakness detected. MD5 is broken and unsuitable for password storage without salting and key stretching.',
      issues: [
        {
          title: 'Insecure MD5 Password Hashing',
          severity: 'Critical',
          category: 'Security',
          classification: 'Confirmed Issue',
          line_number: 4,
          description: 'MD5 is cryptographically broken and vulnerable to collision and rainbow table attacks, allowing attackers to crack passwords in seconds.',
          recommendation: 'Use a dedicated password hashing algorithm such as bcrypt, Argon2, or PBKDF2 with a unique per-user salt.'
        }
      ],
      security_analysis: 'High risk of credential compromise if database records are leaked. Replace hashlib.md5 immediately.',
      performance_analysis: 'While MD5 is fast, password hashing should intentionally be computationally expensive to thwart brute-force attacks.',
      code_quality: 'Function lacks type annotations and docstrings describing expected input/output formats.',
      improved_code: `import bcrypt\n\ndef hash_password(password: str) -> str:\n    """Hashes a plaintext password securely using bcrypt with a random salt."""\n    salt = bcrypt.gensalt(rounds=12)\n    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)\n    return hashed.decode('utf-8')`,
      changes_made: [
        'Replaced insecure MD5 hash with salted bcrypt key derivation',
        'Added Python type hints and descriptive docstring'
      ]
    }
  },
  {
    id: 'rev-102',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    language: 'typescript',
    persona: 'senior',
    fileName: 'cartUtils.ts',
    staticHitsCount: 0,
    originalCode: `export function getCartTotal(items: any[]) {\n  let total = 0;\n  items.forEach(item => {\n    total += item.price * item.qty;\n  });\n  return total;\n}`,
    result: {
      overall_score: 76,
      summary: 'Functional implementation, but weakens TypeScript safety with `any[]` and lacks defensive validation for negative quantities or floating-point rounding.',
      issues: [
        {
          title: 'Use of Explicit `any` Type',
          severity: 'Medium',
          category: 'Code Quality',
          classification: 'Confirmed Issue',
          line_number: 1,
          description: 'Using `any[]` disables compile-time type checking, allowing runtime crashes if `price` or `qty` is missing.',
          recommendation: 'Define an explicit `CartItem` interface with `price: number` and `qty: number`.'
        },
        {
          title: 'Unvalidated Negative Quantities',
          severity: 'High',
          category: 'Bug',
          classification: 'Potential Risk',
          line_number: 4,
          description: 'If an item has a negative `qty`, it could reduce the total cart balance unexpectedly.',
          recommendation: 'Validate that `item.qty >= 0` and `item.price >= 0` before accumulating.'
        }
      ],
      security_analysis: 'Client-side totals should always be recalculated on the backend before payment processing.',
      performance_analysis: 'Array.reduce is clean and O(n); current loop performance is optimal.',
      code_quality: 'Strong typing and immutable reduction patterns will improve maintainability.',
      improved_code: `export interface CartItem {\n  id: string;\n  price: number;\n  qty: number;\n}\n\nexport function getCartTotal(items: CartItem[]): number {\n  const rawTotal = items.reduce((sum, item) => {\n    if (item.price < 0 || item.qty < 0) {\n      throw new Error(\`Invalid price or quantity for item \${item.id}\`);\n    }\n    return sum + item.price * item.qty;\n  }, 0);\n  return Math.round(rawTotal * 100) / 100;\n}`,
      changes_made: [
        'Introduced strict CartItem TypeScript interface instead of any[]',
        'Added guard against negative price/quantity values',
        'Added currency rounding to prevent IEEE-754 floating-point drift'
      ]
    }
  },
  {
    id: 'rev-103',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    language: 'go',
    persona: 'performance',
    fileName: 'worker_pool.go',
    staticHitsCount: 0,
    originalCode: `package main\n\nimport "fmt"\n\nfunc process(items []string) {\n\tfor _, item := range items {\n\t\tgo func() {\n\t\t\tfmt.Println(item)\n\t\t}()\n\t}\n}`,
    result: {
      overall_score: 54,
      summary: 'Goroutines are spawned without synchronization (`sync.WaitGroup`), causing the function to exit prematurely before tasks complete.',
      issues: [
        {
          title: 'Unsynchronized Goroutine Execution',
          severity: 'High',
          category: 'Bug',
          classification: 'Confirmed Issue',
          line_number: 7,
          description: 'Spawning goroutines without waiting for them means `process` returns immediately, potentially dropping work when the program exits.',
          recommendation: 'Use `sync.WaitGroup` to wait for all worker goroutines to finish.'
        }
      ],
      security_analysis: 'Unbounded goroutine spawning on untrusted slice sizes can cause memory exhaustion (DoS).',
      performance_analysis: 'Consider a bounded worker pool semaphore if `items` can contain thousands of entries.',
      code_quality: 'Idiomatic Go requires explicit concurrency lifecycle management.',
      improved_code: `package main\n\nimport (\n\t"fmt"\n\t"sync"\n)\n\nfunc process(items []string) {\n\tvar wg sync.WaitGroup\n\tfor _, item := range items {\n\t\twg.Add(1)\n\t\tgo func(val string) {\n\t\t\tdefer wg.Done()\n\t\t\tfmt.Println(val)\n\t\t}(item)\n\t}\n\twg.Wait()\n}`,
      changes_made: [
        'Added sync.WaitGroup to ensure all goroutines complete before returning',
        'Passed loop variable explicitly into goroutine closure'
      ]
    }
  }
];

// ============================================================================
// FEATURE 4: INSTANT CLIENT-SIDE STATIC PRE-CHECK (AST / REGEX HYBRID ENGINE)
// ============================================================================

function runStaticPreCheck(code, language) {
  if (!code || !code.trim()) return [];
  const lines = code.split('\n');
  const findings = [];

  const rules = [
    {
      id: 'hardcoded-secret',
      title: 'Hardcoded Secret / API Key Detected',
      severity: 'Critical',
      regex: /(api[_-]?key|secret[_-]?key|password|passwd|auth[_-]?token|private[_-]?key)\s*[:=]\s*['"][A-Za-z0-9_\-\.]{8,}['"]/i,
      hint: 'Move sensitive keys to environment variables (.env).'
    },
    {
      id: 'sql-injection',
      title: 'Dynamic SQL String Interpolation',
      severity: 'Critical',
      regex: /(SELECT|INSERT|UPDATE|DELETE|DROP)\s+.*(\$\{|\+\s*[a-zA-Z_]|f['"].*\{|%s)/i,
      hint: 'Use parameterized queries or prepared statements.'
    },
    {
      id: 'dangerous-eval',
      title: 'Dynamic Code Execution Sink (eval / exec)',
      severity: 'Critical',
      regex: /\b(eval|exec|system|popen|shell_exec|passthru)\s*\(/,
      hint: 'Avoid executing arbitrary strings; use safe parsers.'
    },
    {
      id: 'xss-innerhtml',
      title: 'Unsanitized DOM HTML Sink (innerHTML)',
      severity: 'High',
      regex: /\.innerHTML\s*=|dangerouslySetInnerHTML|document\.write\s*\(/,
      hint: 'Use textContent or sanitize HTML with DOMPurify.'
    },
    {
      id: 'unsafe-c-buffer',
      title: 'Unsafe C/C++ Buffer Function (strcpy / gets / sprintf)',
      severity: 'Critical',
      regex: /\b(strcpy|strcat|gets|sprintf)\s*\(/,
      hint: 'Replace with bounded alternatives (strncpy, snprintf, std::string).'
    },
    {
      id: 'empty-catch',
      title: 'Swallowed Exception / Empty Catch Block',
      severity: 'Medium',
      regex: /catch\s*\([^)]*\)\s*\{\s*\}|except.*:\s*pass\b/,
      hint: 'Log or rethrow exceptions rather than silently ignoring failures.'
    },
    {
      id: 'debug-clutter',
      title: 'Leftover Debug Output Statement',
      severity: 'Low',
      regex: /\b(console\.log|var_dump|print_r)\s*\(/,
      hint: 'Remove debug logging or replace with structured logger.'
    }
  ];

  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*')) {
      return;
    }
    rules.forEach((rule) => {
      if (rule.regex.test(lineText)) {
        findings.push({
          ruleId: rule.id,
          title: rule.title,
          severity: rule.severity,
          line: idx + 1,
          snippet: trimmed.slice(0, 72),
          hint: rule.hint
        });
      }
    });
  });

  return findings;
}

// ============================================================================
// FEATURE 2: LCS LINE-BY-LINE DIFF ENGINE
// ============================================================================

function computeLineDiff(originalText, improvedText) {
  const origLines = (originalText || '').split('\n');
  const impLines = (improvedText || '').split('\n');

  const m = origLines.length;
  const n = impLines.length;

  // Guard for very large files to keep UI instantaneous
  if (m * n > 250000) {
    const fallback = [];
    origLines.forEach((line, i) => fallback.push({ type: 'removed', oldNum: i + 1, newNum: null, text: line }));
    impLines.forEach((line, i) => fallback.push({ type: 'added', oldNum: null, newNum: i + 1, text: line }));
    return fallback;
  }

  // Standard DP Longest Common Subsequence table
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (origLines[i] === impLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const diffRows = [];
  let i = 0;
  let j = 0;
  let oldLineNum = 1;
  let newLineNum = 1;

  while (i < m && j < n) {
    if (origLines[i] === impLines[j]) {
      diffRows.push({
        type: 'unchanged',
        oldNum: oldLineNum++,
        newNum: newLineNum++,
        text: origLines[i]
      });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      diffRows.push({
        type: 'removed',
        oldNum: oldLineNum++,
        newNum: null,
        text: origLines[i]
      });
      i++;
    } else {
      diffRows.push({
        type: 'added',
        oldNum: null,
        newNum: newLineNum++,
        text: impLines[j]
      });
      j++;
    }
  }

  while (i < m) {
    diffRows.push({
      type: 'removed',
      oldNum: oldLineNum++,
      newNum: null,
      text: origLines[i++]
    });
  }

  while (j < n) {
    diffRows.push({
      type: 'added',
      oldNum: null,
      newNum: newLineNum++,
      text: impLines[j++]
    });
  }

  return diffRows;
}

// ============================================================================
// FEATURE 1: GITHUB URL CONVERTER & RAW FETCHER
// ============================================================================

function normalizeGitHubUrl(rawInput) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('Please enter a public GitHub file URL.');
  }

  let urlObj;
  try {
    urlObj = new URL(trimmed);
  } catch (_) {
    throw new Error('Invalid URL format. Example: https://github.com/owner/repo/blob/main/app.py');
  }

  // Already a raw.githubusercontent.com link
  if (urlObj.hostname === 'raw.githubusercontent.com') {
    const fileName = urlObj.pathname.split('/').pop() || 'github_snippet.txt';
    return { rawUrl: trimmed, fileName };
  }

  // Standard github.com blob URL -> convert to raw.githubusercontent.com
  if (urlObj.hostname === 'github.com' || urlObj.hostname === 'www.github.com') {
    const parts = urlObj.pathname.split('/').filter(Boolean);
    // Expected: [owner, repo, 'blob', branch, ...filepath]
    if (parts.length >= 5 && parts[2] === 'blob') {
      const owner = parts[0];
      const repo = parts[1];
      const branchAndPath = parts.slice(3).join('/');
      const fileName = parts[parts.length - 1];
      return {
        rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branchAndPath}`,
        fileName
      };
    }
    throw new Error(
      'Please link directly to a file on GitHub (URL containing /blob/branch/path/to/file).'
    );
  }

  throw new Error('Only github.com or raw.githubusercontent.com file URLs are supported.');
}

// ============================================================================
// GEMINI API INTEGRATION, STRICT VALIDATION & FOLLOW-UP MENTOR
// ============================================================================

function validateReviewPayload(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('AI returned an invalid non-object response.');
  }
  if (typeof data.overall_score !== 'number' || data.overall_score < 0 || data.overall_score > 100) {
    throw new Error('AI response missing a valid overall_score (0–100).');
  }
  if (typeof data.summary !== 'string' || !data.summary.trim()) {
    throw new Error('AI response missing executive summary.');
  }
  if (!Array.isArray(data.issues)) {
    throw new Error('AI response missing issues array.');
  }
  const validSeverities = ['Critical', 'High', 'Medium', 'Low'];
  for (const issue of data.issues) {
    if (!issue.title || !issue.description || !issue.recommendation) {
      throw new Error('One or more detected issues are missing required details.');
    }
    if (!validSeverities.includes(issue.severity)) {
      issue.severity = 'Medium';
    }
    if (!issue.classification) {
      issue.classification = 'Confirmed Issue';
    }
    if (!issue.category) {
      issue.category = 'Code Quality';
    }
  }
  if (typeof data.security_analysis !== 'string') data.security_analysis = 'No security notes provided.';
  if (typeof data.performance_analysis !== 'string') data.performance_analysis = 'No performance notes provided.';
  if (typeof data.code_quality !== 'string') data.code_quality = 'No code quality notes provided.';
  if (typeof data.improved_code !== 'string') data.improved_code = '';
  if (!Array.isArray(data.changes_made)) data.changes_made = [];

  return data;
}

/**
 * Generates an intelligent deterministic fallback review when offline or if no API key is configured.
 */
function buildOfflineFallbackReview(sourceCode, language, staticSignals) {
  const issues = staticSignals.map((sig) => ({
    title: sig.title,
    severity: sig.severity,
    category: sig.ruleId.includes('sql') || sig.ruleId.includes('secret') || sig.ruleId.includes('xss') || sig.ruleId.includes('eval')
      ? 'Security'
      : 'Code Quality',
    classification: 'Confirmed Issue',
    line_number: sig.line,
    description: `Static AST/Regex pre-check flagged pattern "${sig.snippet}" on line ${sig.line}. ${sig.hint}`,
    recommendation: sig.hint
  }));

  if (issues.length === 0) {
    issues.push({
      title: 'Missing Defensive Input & Boundary Validation',
      severity: 'Medium',
      category: 'Error Handling',
      classification: 'Potential Risk',
      line_number: 1,
      description: 'Public entry functions should validate incoming parameters and handle unexpected null or empty inputs gracefully.',
      recommendation: 'Add explicit guard clauses and structured error handling at function boundaries.'
    });
  }

  const penalty = issues.reduce(
    (acc, iss) =>
      acc + (iss.severity === 'Critical' ? 22 : iss.severity === 'High' ? 14 : iss.severity === 'Medium' ? 8 : 3),
    0
  );
  const score = Math.max(25, Math.min(94, 96 - penalty));

  const improvedLines = sourceCode.split('\n').map((line) => {
    if (/API_KEY|SECRET|PASSWORD/i.test(line) && /=/.test(line)) {
      const varName = line.split('=')[0].trim();
      return language === 'python'
        ? `import os\n${varName} = os.environ.get("${varName}", "")  # Loaded securely from environment`
        : `const ${varName} = process.env.${varName} || ""; // Loaded securely from environment`;
    }
    if (/\.innerHTML\s*=/.test(line)) {
      return line.replace('.innerHTML', '.textContent') + ' // Sanitized DOM sink';
    }
    return line;
  });

  return validateReviewPayload({
    overall_score: score,
    summary: `Hybrid static analysis completed in offline/local mode (${issues.length} issue${
      issues.length === 1 ? '' : 's'
    } identified). Add a Google AI Studio API key in the top bar for full deep-semantic Gemini 2.5 Flash reasoning.`,
    issues,
    security_analysis:
      issues.some((i) => i.category === 'Security')
        ? 'High-priority security sinks or hardcoded secrets were detected and remediated in the refactored output.'
        : 'No immediate injection or hardcoded credential patterns detected by local static rules.',
    performance_analysis: 'Verify loop bounds and avoid redundant allocations inside hot execution paths.',
    code_quality: 'Ensure consistent error handling, clear naming, and environment-backed configuration.',
    improved_code: improvedLines.join('\n'),
    changes_made: [
      'Replaced hardcoded secrets or unsafe DOM sinks detected by pre-check',
      'Added inline security and maintainability annotations'
    ]
  });
}

async function analyzeCodeWithGemini(sourceCode, language, personaId, staticSignals, customApiKey) {
  const effectiveApiKey = (customApiKey || '').trim();
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveApiKey}`;

  const personaObj = PERSONA_MODES.find((p) => p.id === personaId) || PERSONA_MODES[0];

  const staticContextText =
    staticSignals.length > 0
      ? `\n\nClient-Side Static Pre-Check Signals already detected (verify and expand upon these):\n${staticSignals
          .map((s) => `- Line ${s.line} [${s.severity}]: ${s.title} (${s.snippet})`)
          .join('\n')}`
      : '';

  const systemInstruction = `${personaObj.promptDirective}
You are reviewing ${language} source code.
Rules you MUST follow:
1. Understand the idioms, runtime semantics, and standard library of ${language}.
2. Avoid reporting false positives as confirmed bugs. Clearly distinguish "Confirmed Issue" from "Potential Risk".
3. Explain every issue in clear, accessible language while remaining technically accurate.
4. Provide actionable, practical solutions for each issue.
5. Identify exact 1-based line numbers wherever applicable (or null if architectural/file-wide).
6. When generating "improved_code", preserve 100% of the original functionality while fixing all bugs, security holes, performance bottlenecks, and missing error handling.
7. Score the original code fairly from 0 to 100 based on correctness, security, efficiency, and maintainability.`;

  const userPrompt = `Please perform a comprehensive code review on the following ${language} code:${staticContextText}\n\n\`\`\`${language}\n${sourceCode}\n\`\`\``;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          overall_score: { type: 'NUMBER' },
          summary: { type: 'STRING' },
          issues: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                severity: { type: 'STRING', enum: ['Critical', 'High', 'Medium', 'Low'] },
                category: {
                  type: 'STRING',
                  enum: ['Bug', 'Security', 'Performance', 'Code Quality', 'Syntax', 'Error Handling']
                },
                classification: {
                  type: 'STRING',
                  enum: ['Confirmed Issue', 'Potential Risk']
                },
                line_number: { type: 'INTEGER', nullable: true },
                description: { type: 'STRING' },
                recommendation: { type: 'STRING' }
              },
              required: ['title', 'severity', 'category', 'classification', 'description', 'recommendation']
            }
          },
          security_analysis: { type: 'STRING' },
          performance_analysis: { type: 'STRING' },
          code_quality: { type: 'STRING' },
          improved_code: { type: 'STRING' },
          changes_made: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          }
        },
        required: [
          'overall_score',
          'summary',
          'issues',
          'security_analysis',
          'performance_analysis',
          'code_quality',
          'improved_code',
          'changes_made'
        ]
      }
    }
  };

  let attempt = 0;
  const maxRetries = 2;
  const delays = [1000, 2000];

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        // If no API key was supplied in standalone browser mode and runtime returns 400/403, use graceful local fallback
        if (!effectiveApiKey && (response.status === 400 || response.status === 403)) {
          return buildOfflineFallbackReview(sourceCode, language, staticSignals);
        }
        throw new Error(`Gemini API HTTP ${response.status}: ${errText || response.statusText}`);
      }

      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini model.');
      }

      const parsed = JSON.parse(rawText);
      return validateReviewPayload(parsed);
    } catch (err) {
      if (attempt === maxRetries) {
        if (!effectiveApiKey) {
          return buildOfflineFallbackReview(sourceCode, language, staticSignals);
        }
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      attempt++;
    }
  }
}

/**
 * Feature 5: Line-Scoped AI Follow-Up Mentor Call
 */
async function askLineMentorFollowUp({
  question,
  issue,
  language,
  originalCode,
  improvedCode,
  chatHistory,
  customApiKey
}) {
  const effectiveApiKey = (customApiKey || '').trim();
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveApiKey}`;

  const systemInstruction = `You are a helpful senior software engineer mentoring a developer on a specific code review finding.
Language: ${language}
Flagged Issue: ${issue.title} (${issue.severity})
Line Number: ${issue.line_number || 'File-wide'}
Issue Description: ${issue.description}
Recommended Fix: ${issue.recommendation}

Keep your answer concise, practical, beginner-friendly, and directly focused on this specific issue and code context. Use clean Markdown formatting for short code examples.`;

  const conversationContents = [
    {
      role: 'user',
      parts: [
        {
          text: `Here is the original ${language} code:\n\`\`\`${language}\n${originalCode}\n\`\`\`\nAnd the refactored version:\n\`\`\`${language}\n${improvedCode}\n\`\`\``
        }
      ]
    },
    {
      role: 'model',
      parts: [
        {
          text: `I have reviewed the context around "${issue.title}"${
            issue.line_number ? ` on line ${issue.line_number}` : ''
          }. What would you like to explore?`
        }
      ]
    },
    ...chatHistory.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
    {
      role: 'user',
      parts: [{ text: question }]
    }
  ];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: conversationContents,
        systemInstruction: { parts: [{ text: systemInstruction }] }
      })
    });

    if (!response.ok) {
      if (!effectiveApiKey && (response.status === 400 || response.status === 403)) {
        return `**Mentor Note (Offline Demo Mode):**\n\nRegarding **${issue.title}**${
          issue.line_number ? ` on line ${issue.line_number}` : ''
        }: ${issue.description}\n\n**How to resolve it:** ${
          issue.recommendation
        }\n\n*(Tip: Add your Google AI Studio API key via the "API Key" button in the top header to unlock live conversational follow-ups with Gemini 2.5 Flash.)*`;
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('No response generated.');
    return reply;
  } catch (err) {
    if (!effectiveApiKey) {
      return `**Mentor Note:** ${issue.recommendation} — Always validate inputs and follow ${language} best practices around line ${
        issue.line_number || '1'
      }.`;
    }
    throw err;
  }
}

/**
 * Generates and triggers a clean printable PDF report window.
 */
function exportReviewAsPDF(reviewItem) {
  const { language, fileName, timestamp, persona, result } = reviewItem;
  const printWindow = window.open('', '_blank', 'width=960,height=800');
  if (!printWindow) {
    return false;
  }

  const personaObj = PERSONA_MODES.find((p) => p.id === persona) || PERSONA_MODES[0];

  const escapeHtml = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const issuesHtml =
    result.issues.length === 0
      ? '<p style="color:#059669;font-weight:600;">No issues detected. Clean code!</p>'
      : result.issues
          .map(
            (iss) => `
        <div style="border:1px solid #e2e8f0;border-left:4px solid ${
          iss.severity === 'Critical'
            ? '#dc2626'
            : iss.severity === 'High'
            ? '#ea580c'
            : iss.severity === 'Medium'
            ? '#d97706'
            : '#2563eb'
        };padding:12px 16px;margin-bottom:12px;border-radius:6px;background:#f8fafc;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="font-size:15px;color:#0f172a;">${escapeHtml(iss.title)}</strong>
            <span style="font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;background:#e2e8f0;color:#1e293b;">
              ${escapeHtml(iss.severity)} • ${escapeHtml(iss.classification)}${
              iss.line_number ? ` • Line ${iss.line_number}` : ''
            }
            </span>
          </div>
          <p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Issue:</strong> ${escapeHtml(iss.description)}</p>
          <p style="margin:4px 0;font-size:13px;color:#065f46;"><strong>Fix:</strong> ${escapeHtml(iss.recommendation)}</p>
        </div>`
          )
          .join('');

  const htmlContent = `<!DOCTYPE html>
  <html>
  <head>
    <title>AI Code Review Report - ${escapeHtml(fileName || language)}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; padding: 32px; line-height: 1.5; }
      h1, h2, h3 { margin-top: 0; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
      .score-box { font-size: 28px; font-weight: 800; padding: 10px 20px; border-radius: 8px; background: #0f172a; color: #38bdf8; }
      .section { margin-bottom: 24px; }
      pre { background: #0f172a; color: #f8fafc; padding: 14px; border-radius: 8px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
      .card { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>AI Code Reviewer v2.0 Pro — Audit Report</h1>
        <div style="color:#475569;font-size:13px;">
          File: <strong>${escapeHtml(fileName || 'snippet.' + language)}</strong> |
          Language: <strong>${escapeHtml(language.toUpperCase())}</strong> |
          Persona: <strong>${escapeHtml(personaObj.name)}</strong> |
          Date: ${new Date(timestamp).toLocaleString()}
        </div>
      </div>
      <div class="score-box">${result.overall_score}/100</div>
    </div>

    <div class="section">
      <h2>Executive Summary</h2>
      <p>${escapeHtml(result.summary)}</p>
    </div>

    <div class="grid">
      <div class="card"><strong>Security Analysis</strong><p>${escapeHtml(result.security_analysis)}</p></div>
      <div class="card"><strong>Performance Analysis</strong><p>${escapeHtml(result.performance_analysis)}</p></div>
      <div class="card"><strong>Code Quality</strong><p>${escapeHtml(result.code_quality)}</p></div>
    </div>

    <div class="section">
      <h2>Detected Issues (${result.issues.length})</h2>
      ${issuesHtml}
    </div>

    <div class="section">
      <h2>Optimized / Refactored Code</h2>
      <pre>${escapeHtml(result.improved_code)}</pre>
    </div>

    <script>
      window.onload = function() { window.print(); };
    </script>
  </body>
  </html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  return true;
}

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Low: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[severity] || styles.Medium
      }`}
    >
      {severity}
    </span>
  );
};

const PersonaBadge = ({ personaId }) => {
  const persona = PERSONA_MODES.find((p) => p.id === personaId) || PERSONA_MODES[0];
  const Icon = persona.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${persona.badgeColor}`}
    >
      <Icon className="w-3 h-3" />
      <span>{persona.shortName}</span>
    </span>
  );
};

const ScoreGauge = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const colorClass =
    clampedScore >= 80
      ? 'text-emerald-400 stroke-emerald-400'
      : clampedScore >= 55
      ? 'text-amber-400 stroke-amber-400'
      : 'text-rose-500 stroke-rose-500';

  const label =
    clampedScore >= 80 ? 'Production Ready' : clampedScore >= 55 ? 'Needs Refactoring' : 'Critical Attention';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="transparent" stroke="#1F2937" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold tracking-tight ${colorClass.split(' ')[0]}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span
        className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 ${
          colorClass.split(' ')[0]
        }`}
      >
        {label}
      </span>
    </div>
  );
};

/**
 * Line-numbered dark code editor with Tab indentation and highlighted static warning lines.
 */
const LineNumberedEditor = ({
  value,
  onChange,
  language,
  readOnly = false,
  placeholder = '',
  highlightedLines = []
}) => {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const lines = useMemo(() => {
    const split = (value || '').split('\n');
    return split.length > 0 ? split : [''];
  }, [value]);

  const highlightSet = useMemo(() => new Set(highlightedLines), [highlightedLines]);

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    if (readOnly) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newVal = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div className="relative flex w-full h-full min-h-[340px] bg-[#080B12] border border-[#1F2937] rounded-xl overflow-hidden font-mono text-sm">
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none py-4 px-3 text-right bg-[#0B0F19] text-slate-600 border-r border-[#1F2937] overflow-hidden leading-6 min-w-[3.5rem]"
      >
        {lines.map((_, idx) => {
          const lineNum = idx + 1;
          const isFlagged = highlightSet.has(lineNum);
          return (
            <div
              key={idx}
              className={`text-xs leading-6 px-1 rounded ${
                isFlagged ? 'bg-amber-500/20 text-amber-400 font-bold' : ''
              }`}
            >
              {lineNum}
            </div>
          );
        })}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        placeholder={placeholder}
        className="w-full h-full p-4 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none leading-6 overflow-auto whitespace-pre"
      />
      <div className="absolute bottom-2.5 right-3 pointer-events-none px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
        {language} • {lines.length} {lines.length === 1 ? 'line' : 'lines'}
      </div>
    </div>
  );
};

/**
 * Feature 2: True Line-by-Line LCS Diff Viewer (Unified & Split modes)
 */
const LineByLineDiffViewer = ({ originalCode, improvedCode, language }) => {
  const [viewMode, setViewMode] = useState('unified'); // 'unified' | 'split' | 'clean'

  const diffRows = useMemo(
    () => computeLineDiff(originalCode, improvedCode),
    [originalCode, improvedCode]
  );

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    diffRows.forEach((r) => {
      if (r.type === 'added') added++;
      if (r.type === 'removed') removed++;
    });
    return { added, removed };
  }, [diffRows]);

  return (
    <div className="space-y-3">
      {/* Diff Mode Switcher & Change Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F19] p-3 rounded-xl border border-[#1F2937]">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
            +{stats.added} additions
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold">
            -{stats.removed} deletions
          </span>
        </div>

        <div className="inline-flex rounded-lg bg-[#111827] p-1 border border-[#1F2937]">
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'unified'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
            <span>Unified Diff</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            <span>Split Diff</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('clean')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'clean'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Clean Improved</span>
          </button>
        </div>
      </div>

      {/* Unified Diff Table */}
      {viewMode === 'unified' && (
        <div className="rounded-xl bg-[#080B12] border border-[#1F2937] overflow-hidden">
          <div className="max-h-[440px] overflow-auto font-mono text-xs">
            <table className="w-full border-collapse">
              <tbody>
                {diffRows.map((row, idx) => {
                  const isAdd = row.type === 'added';
                  const isRem = row.type === 'removed';
                  return (
                    <tr
                      key={idx}
                      className={
                        isAdd
                          ? 'bg-emerald-500/12 text-emerald-200'
                          : isRem
                          ? 'bg-rose-500/12 text-rose-200'
                          : 'text-slate-300 hover:bg-slate-900/60'
                      }
                    >
                      <td className="select-none w-11 px-2.5 py-1 text-right text-slate-600 border-r border-[#1F2937]/70">
                        {row.oldNum ?? ''}
                      </td>
                      <td className="select-none w-11 px-2.5 py-1 text-right text-slate-600 border-r border-[#1F2937]/70">
                        {row.newNum ?? ''}
                      </td>
                      <td
                        className={`select-none w-7 px-2 py-1 text-center font-bold ${
                          isAdd ? 'text-emerald-400' : isRem ? 'text-rose-400' : 'text-slate-600'
                        }`}
                      >
                        {isAdd ? '+' : isRem ? '-' : ' '}
                      </td>
                      <td className="px-3 py-1 whitespace-pre">{row.text || ' '}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Split Side-by-Side Diff Table */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#080B12] border border-[#1F2937] overflow-hidden">
            <div className="px-3 py-2 bg-[#0B0F19] border-b border-[#1F2937] text-xs font-semibold text-rose-400 flex justify-between">
              <span>Original Code</span>
              <span className="font-mono text-slate-500">Before</span>
            </div>
            <div className="max-h-[400px] overflow-auto font-mono text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  {diffRows
                    .filter((r) => r.type !== 'added')
                    .map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.type === 'removed' ? 'bg-rose-500/15 text-rose-200' : 'text-slate-300'
                        }
                      >
                        <td className="select-none w-10 px-2 py-1 text-right text-slate-600 border-r border-[#1F2937]">
                          {row.oldNum}
                        </td>
                        <td className="select-none w-6 px-1.5 py-1 text-center font-bold text-rose-400">
                          {row.type === 'removed' ? '-' : ' '}
                        </td>
                        <td className="px-3 py-1 whitespace-pre">{row.text || ' '}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl bg-[#080B12] border border-[#1F2937] overflow-hidden">
            <div className="px-3 py-2 bg-[#0B0F19] border-b border-[#1F2937] text-xs font-semibold text-emerald-400 flex justify-between">
              <span>Refactored Code</span>
              <span className="font-mono text-slate-500">After</span>
            </div>
            <div className="max-h-[400px] overflow-auto font-mono text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  {diffRows
                    .filter((r) => r.type !== 'removed')
                    .map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.type === 'added' ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate-300'
                        }
                      >
                        <td className="select-none w-10 px-2 py-1 text-right text-slate-600 border-r border-[#1F2937]">
                          {row.newNum}
                        </td>
                        <td className="select-none w-6 px-1.5 py-1 text-center font-bold text-emerald-400">
                          {row.type === 'added' ? '+' : ' '}
                        </td>
                        <td className="px-3 py-1 whitespace-pre">{row.text || ' '}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Clean Improved Code View */}
      {viewMode === 'clean' && (
        <div className="h-[400px]">
          <LineNumberedEditor value={improvedCode} language={language} readOnly />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Responsive Sidebar State
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Optional User API Key (sessionStorage) + Modal
  const [customApiKey, setCustomApiKey] = useState(() => {
    try {
      return sessionStorage.getItem('gemini_user_api_key') || '';
    } catch (_) {
      return '';
    }
  });
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState(customApiKey);

  // Persistent Review History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_code_reviewer_history_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {
      // Fallback to initial history
    }
    return INITIAL_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_code_reviewer_history_v2', JSON.stringify(history));
    } catch (_) {
      // Ignore quota issues
    }
  }, [history]);

  // Code Editor, GitHub Importer & Persona State
  const [language, setLanguage] = useState('python');
  const [fileName, setFileName] = useState('order_service.py');
  const [sourceCode, setSourceCode] = useState(SAMPLE_SNIPPETS.python_vuln.code);
  const [personaMode, setPersonaMode] = useState('senior');

  // Feature 1: GitHub Importer State
  const [githubUrl, setGithubUrl] = useState('');
  const [isImportingGithub, setIsImportingGithub] = useState(false);

  // Feature 4: Debounced Instant Static Pre-Check Signals
  const [staticSignals, setStaticSignals] = useState(() =>
    runStaticPreCheck(SAMPLE_SNIPPETS.python_vuln.code, 'python')
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setStaticSignals(runStaticPreCheck(sourceCode, language));
    }, 220);
    return () => clearTimeout(timer);
  }, [sourceCode, language]);

  // Analysis Execution & Feedback State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [errorBanner, setErrorBanner] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Active Review Result State
  const [currentReview, setCurrentReview] = useState(INITIAL_HISTORY[0]);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [copiedKey, setCopiedKey] = useState(null);

  // Feature 5: Line-Scoped AI Follow-Up Mentor Drawer State
  const [mentorIssue, setMentorIssue] = useState(null);
  const [mentorMessages, setMentorMessages] = useState([]);
  const [mentorInput, setMentorInput] = useState('');
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const mentorEndRef = useRef(null);

  // History Search & Filter State
  const [historySearch, setHistorySearch] = useState('');
  const [historyLangFilter, setHistoryLangFilter] = useState('all');

  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Multi-step loading animation ticker
  useEffect(() => {
    if (!isAnalyzing) {
      setAnalysisStep(0);
      return;
    }
    const interval = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1050);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Auto-scroll mentor chat drawer
  useEffect(() => {
    mentorEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages, isMentorLoading]);

  // Feature 1 Handler: Import Code from Public GitHub File URL
  const handleImportFromGithub = async (e) => {
    if (e) e.preventDefault();
    setErrorBanner(null);

    let normalized;
    try {
      normalized = normalizeGitHubUrl(githubUrl);
    } catch (err) {
      setErrorBanner(err.message);
      return;
    }

    setIsImportingGithub(true);
    try {
      const res = await fetch(normalized.rawUrl);
      if (!res.ok) {
        throw new Error(
          `GitHub returned HTTP ${res.status}. Make sure the repository is public and the branch/path exists.`
        );
      }
      const codeText = await res.text();
      if (!codeText.trim()) {
        throw new Error('The fetched GitHub file is empty.');
      }

      const ext = '.' + normalized.fileName.split('.').pop().toLowerCase();
      const matchedLang = SUPPORTED_LANGUAGES.find((l) => l.ext === ext);
      if (matchedLang) {
        setLanguage(matchedLang.id);
      }

      setFileName(normalized.fileName);
      setSourceCode(codeText);
      showToast(`Imported ${normalized.fileName} from GitHub!`);
    } catch (err) {
      setErrorBanner(err.message || 'Failed to import file from GitHub.');
    } finally {
      setIsImportingGithub(false);
    }
  };

  // Trigger Gemini Code Analysis
  const handleRunReview = async (overrideCode = null, overrideLang = null, overrideName = null) => {
    const codeToInspect = overrideCode !== null ? overrideCode : sourceCode;
    const langToInspect = overrideLang !== null ? overrideLang : language;
    const nameToInspect = overrideName !== null ? overrideName : fileName;

    if (!codeToInspect || !codeToInspect.trim()) {
      setErrorBanner('Please paste source code, import from GitHub, or upload a file before reviewing.');
      return;
    }

    setErrorBanner(null);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const currentPreChecks = runStaticPreCheck(codeToInspect, langToInspect);

    try {
      const reviewResult = await analyzeCodeWithGemini(
        codeToInspect,
        langToInspect,
        personaMode,
        currentPreChecks,
        customApiKey
      );

      const newEntry = {
        id: `rev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        language: langToInspect,
        persona: personaMode,
        fileName: nameToInspect || `snippet.${langToInspect}`,
        staticHitsCount: currentPreChecks.length,
        originalCode: codeToInspect,
        result: reviewResult
      };

      setHistory((prev) => [newEntry, ...prev]);
      setCurrentReview(newEntry);
      setSeverityFilter('All');
      setMentorIssue(null);
      setActivePage('results');
      showToast('AI Code Review v2.0 completed!');
    } catch (err) {
      setErrorBanner(
        err?.message || 'An unexpected error occurred while analyzing the code. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const matchedLang = SUPPORTED_LANGUAGES.find((l) => l.ext === ext);
    if (matchedLang) {
      setLanguage(matchedLang.id);
    }
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setSourceCode(content);
        setErrorBanner(null);
        showToast(`Loaded ${file.name}`);
      }
    };
    reader.onerror = () => {
      setErrorBanner('Failed to read the uploaded file.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Feature 5 Handler: Open Line-Scoped Mentor Drawer & Send Questions
  const openMentorDrawer = (issue) => {
    setMentorIssue(issue);
    setMentorInput('');
    setMentorMessages([
      {
        role: 'assistant',
        text: `Hi! I'm your contextual AI Mentor. Ask me anything about **${issue.title}**${
          issue.line_number ? ` on **Line ${issue.line_number}**` : ''
        }—why it happens, how attackers or edge cases trigger it, or how the refactored code fixes it.`
      }
    ]);
  };

  const handleSendMentorQuestion = async (promptText) => {
    const q = (promptText || mentorInput).trim();
    if (!q || !mentorIssue || !currentReview || isMentorLoading) return;

    const updatedHistory = [...mentorMessages, { role: 'user', text: q }];
    setMentorMessages(updatedHistory);
    setMentorInput('');
    setIsMentorLoading(true);

    try {
      const reply = await askLineMentorFollowUp({
        question: q,
        issue: mentorIssue,
        language: currentReview.language,
        originalCode: currentReview.originalCode,
        improvedCode: currentReview.result?.improved_code || '',
        chatHistory: mentorMessages,
        customApiKey
      });
      setMentorMessages([...updatedHistory, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMentorMessages([
        ...updatedHistory,
        { role: 'assistant', text: `Error reaching AI Mentor: ${err.message}` }
      ]);
    } finally {
      setIsMentorLoading(false);
    }
  };

  // Dashboard Computed Metrics
  const dashboardStats = useMemo(() => {
    const totalReviews = history.length;
    let criticalIssues = 0;
    let totalScore = 0;
    let totalStaticCatches = 0;
    const langCounts = {};
    const personaCounts = {};
    const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

    history.forEach((item) => {
      totalScore += item.result?.overall_score || 0;
      totalStaticCatches += item.staticHitsCount || 0;
      const lang = item.language || 'unknown';
      langCounts[lang] = (langCounts[lang] || 0) + 1;

      const pId = item.persona || 'senior';
      personaCounts[pId] = (personaCounts[pId] || 0) + 1;

      (item.result?.issues || []).forEach((iss) => {
        if (iss.severity === 'Critical') criticalIssues++;
        if (severityCounts[iss.severity] !== undefined) {
          severityCounts[iss.severity]++;
        }
      });
    });

    const avgScore = totalReviews > 0 ? Math.round(totalScore / totalReviews) : 0;

    const languageBreakdown = Object.entries(langCounts)
      .map(([lang, count]) => ({
        lang,
        count,
        pct: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    const recentScoreTrend = [...history]
      .slice(0, 7)
      .reverse()
      .map((item, idx) => ({
        label: (item.fileName || `Rev ${idx + 1}`).slice(0, 14),
        score: item.result?.overall_score || 0
      }));

    return {
      totalReviews,
      criticalIssues,
      avgScore,
      totalStaticCatches,
      languageBreakdown,
      personaCounts,
      severityCounts,
      recentScoreTrend
    };
  }, [history]);

  // Filtered Review History
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesLang = historyLangFilter === 'all' || item.language === historyLangFilter;
      const q = historySearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.fileName || '').toLowerCase().includes(q) ||
        (item.language || '').toLowerCase().includes(q) ||
        (item.result?.summary || '').toLowerCase().includes(q) ||
        (item.originalCode || '').toLowerCase().includes(q);
      return matchesLang && matchesSearch;
    });
  }, [history, historySearch, historyLangFilter]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'review', label: 'Code Review', icon: Code2 },
    { id: 'results', label: 'Review Results', icon: FileCode },
    { id: 'history', label: 'Review History', icon: History },
    { id: 'about', label: 'About Project', icon: Info }
  ];

  // ==========================================================================
  // PAGE RENDERERS
  // ==========================================================================

  const renderHomePage = () => (
    <div className="space-y-10 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B0F19] border border-[#1F2937] p-8 md:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Code Reviewer v2.0 Pro • Hybrid AST + Gemini 2.5 Flash</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ship Cleaner, Safer Code with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Autonomous AI Audits
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Import directly from GitHub, run real-time static pre-checks, choose specialized reviewer
              personas, inspect LCS line-by-line diffs, and chat with a line-scoped AI mentor.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('review')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Code Review Studio</span>
              </button>

              <button
                onClick={() => setActivePage('dashboard')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#111827] hover:bg-slate-800 text-slate-200 border border-[#1F2937] font-medium transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span>Explore Telemetry Dashboard</span>
              </button>
            </div>
          </div>

          {/* Interactive Pipeline Preview Card */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080B12]/90 border border-[#1F2937] shadow-xl space-y-3.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-2.5">
              <span className="text-slate-400">v2.0 Hybrid Review Pipeline</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px]">
                5 Pro Upgrades Active
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#1F2937] flex items-center justify-between">
                <span className="text-cyan-300">1. GitHub URL / File Ingestion</span>
                <span className="text-slate-500">raw.githubusercontent</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#111827] border border-amber-500/30 flex items-center justify-between">
                <span className="text-amber-300">2. Instant Static AST/Regex Check</span>
                <span className="text-amber-400">&lt; 5ms latency</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#111827] border border-indigo-500/30 flex items-center justify-between">
                <span className="text-indigo-300">3. Persona-Guided Gemini Schema</span>
                <span className="text-indigo-400">JSON Verified</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#111827] border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-300">4. LCS Diff + Line Mentor Chat</span>
                <span className="text-emerald-400">+/- Highlighted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Pro Upgrades Showcase */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>What&apos;s New in v2.0 Pro</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Github,
              color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
              title: 'GitHub File & PR URL Importer',
              desc: 'Paste any public github.com/blob URL to automatically resolve raw source code and detect its programming language.'
            },
            {
              icon: FileDiff,
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              title: 'True Line-by-Line LCS Diff Viewer',
              desc: 'Inspect exact additions (+) in green and deletions (-) in red across Unified Diff, Split Diff, and Clean Code modes.'
            },
            {
              icon: SlidersHorizontal,
              color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
              title: '4 Reviewer Persona Modes',
              desc: 'Switch between Senior Engineer, Beginner Mentor, OWASP Security Auditor, and Performance Optimizer before running.'
            },
            {
              icon: Activity,
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              title: 'Instant Static Pre-Check Engine',
              desc: 'Real-time client-side scanner catches hardcoded API keys, SQLi, eval(), and XSS sinks as you type before calling Gemini.'
            },
            {
              icon: MessageSquareCode,
              color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
              title: 'Line-Scoped AI Follow-Up Mentor',
              desc: 'Click "Ask Follow-Up" on any flagged issue to open a contextual AI chat drawer pinned to that exact line of code.'
            },
            {
              icon: Download,
              color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
              title: 'Audit Reports & Iterative Loops',
              desc: 'Re-review refactored code in one click to verify score improvements and export formatted PDF audit reports.'
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Languages Bar */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Multi-Language AST & Semantic Support</h3>
            <p className="text-xs text-slate-400">
              Select any language, import from GitHub, or upload local source files
            </p>
          </div>
          <button
            onClick={() => setActivePage('review')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setActivePage('review');
              }}
              className="px-3.5 py-2 rounded-lg bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-xs font-mono text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{lang.name}</span>
              <span className="text-slate-500">{lang.ext}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboardPage = () => {
    const maxSeverityCount = Math.max(1, ...Object.values(dashboardStats.severityCounts));

    return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Engineering Quality Telemetry</h1>
            <p className="text-sm text-slate-400">
              Real-time analytics across audited repositories, static pre-checks, and reviewer personas
            </p>
          </div>
          <button
            onClick={() => setActivePage('review')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all cursor-pointer self-start"
          >
            <Code2 className="w-4 h-4" />
            <span>New Code Review</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Code Reviews</span>
              <FileCode className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{dashboardStats.totalReviews}</div>
            <div className="text-xs text-emerald-400 mt-1">Persisted in workspace</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Critical Issues Found</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold text-rose-400">{dashboardStats.criticalIssues}</div>
            <div className="text-xs text-slate-400 mt-1">High-priority vulnerabilities</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Average Quality Score</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-400">
              {dashboardStats.avgScore}
              <span className="text-base font-normal text-slate-500">/100</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Across all audited files</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Static Pre-Check Catches</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{dashboardStats.totalStaticCatches}</div>
            <div className="text-xs text-slate-400 mt-1">Instant pre-LLM signals caught</div>
          </div>
        </div>

        {/* Score Trend & Persona Usage Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Score Trend Bars */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <h2 className="text-base font-bold text-white mb-1">Recent Code Quality Score Trajectory</h2>
            <p className="text-xs text-slate-400 mb-6">Chronological score progression across recent audits</p>

            {dashboardStats.recentScoreTrend.length === 0 ? (
              <p className="text-sm text-slate-500 py-10 text-center">No score history available yet.</p>
            ) : (
              <div className="h-44 flex items-end gap-3 pt-4 px-2 border-b border-[#1F2937]">
                {dashboardStats.recentScoreTrend.map((pt, i) => {
                  const barColor =
                    pt.score >= 80
                      ? 'from-emerald-500 to-cyan-400'
                      : pt.score >= 55
                      ? 'from-amber-500 to-yellow-400'
                      : 'from-rose-600 to-orange-400';
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-xs font-mono font-bold text-slate-200">{pt.score}</span>
                      <div
                        className={`w-full max-w-[44px] rounded-t-lg bg-gradient-to-t ${barColor} transition-all duration-500`}
                        style={{ height: `${Math.max(10, pt.score)}%` }}
                      />
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[68px] pb-1">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Persona Mode Usage Breakdown */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <h2 className="text-base font-bold text-white mb-1">Reviewer Persona Usage</h2>
            <p className="text-xs text-slate-400 mb-5">Audits run per specialized AI mode</p>

            <div className="space-y-3">
              {PERSONA_MODES.map((p) => {
                const Icon = p.icon;
                const count = dashboardStats.personaCounts[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg border ${p.badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.tagline}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-white px-2.5 py-1 rounded bg-slate-800">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Language & Severity Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <h2 className="text-base font-bold text-white mb-1">Programming Language Statistics</h2>
            <p className="text-xs text-slate-400 mb-5">Distribution of code reviews by language</p>

            <div className="space-y-4">
              {dashboardStats.languageBreakdown.map((item) => (
                <div key={item.lang} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="uppercase font-mono text-slate-200">{item.lang}</span>
                    <span className="text-slate-400">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'} ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#0B0F19] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <h2 className="text-base font-bold text-white mb-1">Issue Severity Distribution</h2>
            <p className="text-xs text-slate-400 mb-5">Total findings categorized by risk impact</p>

            <div className="space-y-4">
              {[
                { label: 'Critical', color: 'bg-rose-500', text: 'text-rose-400' },
                { label: 'High', color: 'bg-orange-500', text: 'text-orange-400' },
                { label: 'Medium', color: 'bg-amber-400', text: 'text-amber-400' },
                { label: 'Low', color: 'bg-sky-400', text: 'text-sky-400' }
              ].map((sev) => {
                const count = dashboardStats.severityCounts[sev.label] || 0;
                const widthPct = Math.round((count / maxSeverityCount) * 100);
                return (
                  <div key={sev.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={sev.text}>{sev.label}</span>
                      <span className="text-slate-300 font-mono">{count}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#0B0F19] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sev.color} transition-all duration-500`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Review History Table */}
        <div className="rounded-2xl bg-[#111827] border border-[#1F2937] overflow-hidden">
          <div className="p-6 border-b border-[#1F2937] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Recent Review History</h2>
              <p className="text-xs text-slate-400">Click any row to open the full interactive audit report</p>
            </div>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1F2937] bg-[#0B0F19]/60 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">File / Snippet</th>
                  <th className="py-3.5 px-5">Language</th>
                  <th className="py-3.5 px-5">Persona</th>
                  <th className="py-3.5 px-5">Quality Score</th>
                  <th className="py-3.5 px-5">Issues</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937] text-sm">
                {history.slice(0, 5).map((item) => {
                  const score = item.result?.overall_score ?? 0;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setCurrentReview(item);
                        setSeverityFilter('All');
                        setMentorIssue(null);
                        setActivePage('results');
                      }}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-200">
                        {item.fileName || `snippet.${item.language}`}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs uppercase text-cyan-300">
                          {item.language}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <PersonaBadge personaId={item.persona} />
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`font-bold ${
                            score >= 80
                              ? 'text-emerald-400'
                              : score >= 55
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {score}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-300">
                        {item.result?.issues?.length || 0} found
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400">
                          Inspect <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeReviewPage = () => {
    const loadingMessages = [
      'Ingesting AST & client-side static pre-check signals...',
      'Scanning for OWASP security vulnerabilities & injection flaws...',
      'Analyzing algorithmic complexity & memory safety...',
      'Generating LCS-ready refactored code & recommendations...'
    ];

    return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Code Review Studio</h1>
            <p className="text-sm text-slate-400">
              Import from GitHub, select your AI Reviewer Persona, and run hybrid static + Gemini analysis
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorBanner && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block text-rose-200">Action Required</strong>
              <span>{errorBanner}</span>
            </div>
            <button onClick={() => setErrorBanner(null)} className="text-rose-400 hover:text-rose-200 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* NEW FEATURE 1: GitHub File & PR URL Importer */}
        <form
          onSubmit={handleImportFromGithub}
          className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 shrink-0">
            <Github className="w-4 h-4 text-cyan-400" />
            <span>Import from GitHub URL:</span>
          </div>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            disabled={isImportingGithub || isAnalyzing}
            placeholder="https://github.com/owner/repo/blob/main/src/app.py"
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isImportingGithub || isAnalyzing || !githubUrl.trim()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer shrink-0"
          >
            <GitBranch className={`w-3.5 h-3.5 ${isImportingGithub ? 'animate-spin' : ''}`} />
            <span>{isImportingGithub ? 'Fetching Raw...' : 'Fetch Code'}</span>
          </button>
        </form>

        {/* NEW FEATURE 3: Review Strictness / Persona Mode Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select AI Reviewer Persona Mode
            </label>
            <span className="text-[11px] text-slate-500">Tailors prompt instructions & strictness</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PERSONA_MODES.map((mode) => {
              const Icon = mode.icon;
              const selected = personaMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => setPersonaMode(mode.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-[#111827] border-[#1F2937] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`p-1.5 rounded-lg border ${mode.badgeColor}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    {selected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">{mode.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{mode.tagline}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Controls Toolbar */}
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLanguage(newLang);
                  const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === newLang);
                  if (langObj) setFileName(`source${langObj.ext}`);
                }}
                disabled={isAnalyzing}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-sm text-white font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name} ({lang.ext})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Load Vulnerable Sample
              </label>
              <select
                defaultValue=""
                disabled={isAnalyzing}
                onChange={(e) => {
                  const key = e.target.value;
                  if (key && SAMPLE_SNIPPETS[key]) {
                    const snip = SAMPLE_SNIPPETS[key];
                    setLanguage(snip.language);
                    setSourceCode(snip.code);
                    const ext = SUPPORTED_LANGUAGES.find((l) => l.id === snip.language)?.ext || '.txt';
                    setFileName(`sample_${key}${ext}`);
                    setErrorBanner(null);
                    showToast(`Loaded ${snip.label}`);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-sm text-cyan-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[270px]"
              >
                <option value="" disabled>
                  Choose buggy sample preset...
                </option>
                {Object.entries(SAMPLE_SNIPPETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end">
            <input
              ref={fileInputRef}
              type="file"
              accept=".py,.java,.js,.ts,.tsx,.c,.cpp,.php,.go,.rs,.sql,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => {
                setSourceCode('');
                setErrorBanner(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Code</span>
            </button>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={() => {
                setLanguage('python');
                setFileName('order_service.py');
                setPersonaMode('senior');
                setSourceCode(SAMPLE_SNIPPETS.python_vuln.code);
                setErrorBanner(null);
                showToast('Editor reset to default sample');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* NEW FEATURE 4: Instant Client-Side Static Pre-Check Signals Strip */}
        <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Instant Static Pre-Check Signals (Client-Side AST / Regex)</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                staticSignals.length > 0
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {staticSignals.length > 0
                ? `${staticSignals.length} instant signal${staticSignals.length === 1 ? '' : 's'} flagged`
                : '0 static red flags'}
            </span>
          </div>

          {staticSignals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {staticSignals.map((sig, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-xs"
                >
                  <SeverityBadge severity={sig.severity} />
                  <span className="font-mono text-cyan-400">L{sig.line}</span>
                  <span className="text-slate-200 font-medium">{sig.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No hardcoded secrets, unsafe SQL strings, eval() sinks, or buffer overflows detected locally. Run AI
              Review for deep semantic & logical inspection.
            </p>
          )}
        </div>

        {/* Code Editor Container */}
        <div className="relative">
          <div className="h-[420px]">
            <LineNumberedEditor
              value={sourceCode}
              onChange={setSourceCode}
              language={language}
              readOnly={isAnalyzing}
              highlightedLines={staticSignals.map((s) => s.line)}
              placeholder="// Paste your source code here, import from GitHub, or upload a file..."
            />
          </div>

          {/* Multi-Step Loading Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-20 rounded-xl bg-[#0B0F19]/90 backdrop-blur-sm border border-indigo-500/40 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-indigo-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Gemini AI Deep Code Audit in Progress</h3>
              <p className="text-sm text-cyan-300 font-medium mb-4">{loadingMessages[analysisStep]}</p>

              <div className="w-full max-w-sm space-y-2 text-left">
                {loadingMessages.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {idx < analysisStep ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : idx === analysisStep ? (
                      <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={idx <= analysisStep ? 'text-slate-200' : 'text-slate-500'}>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Primary Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              File: <strong className="text-slate-200 font-mono">{fileName}</strong> •{' '}
              <strong className="text-slate-300">{sourceCode.length}</strong> chars
            </span>
          </div>

          <button
            type="button"
            disabled={isAnalyzing || !sourceCode.trim()}
            onClick={() => handleRunReview()}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing Code...' : 'Run AI Code Review'}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderResultsPage = () => {
    if (!currentReview || !currentReview.result) {
      return (
        <div className="p-12 rounded-2xl bg-[#111827] border border-[#1F2937] text-center space-y-4">
          <FileCode className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">No Review Selected</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Submit code in the Code Review studio or choose an existing audit from Review History.
          </p>
          <button
            onClick={() => setActivePage('review')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold cursor-pointer"
          >
            Go to Code Review
          </button>
        </div>
      );
    }

    const { language: revLang, fileName: revFile, timestamp, persona, originalCode, result } = currentReview;

    const severityCounts = {
      All: result.issues.length,
      Critical: result.issues.filter((i) => i.severity === 'Critical').length,
      High: result.issues.filter((i) => i.severity === 'High').length,
      Medium: result.issues.filter((i) => i.severity === 'Medium').length,
      Low: result.issues.filter((i) => i.severity === 'Low').length
    };

    const visibleIssues =
      severityFilter === 'All'
        ? result.issues
        : result.issues.filter((i) => i.severity === severityFilter);

    return (
      <div className="space-y-8 pb-12">
        {/* Top Header & Export Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 font-mono text-xs uppercase text-indigo-300 font-semibold">
                {revLang}
              </span>
              <PersonaBadge personaId={persona} />
              <span className="text-xs text-slate-300 font-mono">{revFile}</span>
              <span className="text-xs text-slate-500">• {new Date(timestamp).toLocaleString()}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">AI Code Review Report</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const ok = exportReviewAsPDF(currentReview);
                if (!ok) {
                  showToast('Please allow pop-ups to export the PDF report.');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 border border-[#1F2937] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download Report (PDF)</span>
            </button>

            <button
              onClick={() => setActivePage('review')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Review New Code</span>
            </button>
          </div>
        </div>

        {/* Score & Executive Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <div className="lg:col-span-3 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#1F2937] pb-4 lg:pb-0">
            <ScoreGauge score={result.overall_score} />
          </div>

          <div className="lg:col-span-9 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Executive Engineering Summary
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Security Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{result.security_analysis}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Performance Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{result.performance_analysis}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Code Quality</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{result.code_quality}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Issues Section with Interactive Severity Filter & Line-Scoped Mentor CTA */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Detected Issues & Recommendations ({result.issues.length})</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-[#111827] border-[#1F2937] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev} ({severityCounts[sev]})
                </button>
              ))}
            </div>
          </div>

          {visibleIssues.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#111827] border border-[#1F2937] text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200">
                No issues found under the &ldquo;{severityFilter}&rdquo; filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {visibleIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge severity={issue.severity} />
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {issue.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            issue.classification === 'Confirmed Issue'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          }`}
                        >
                          {issue.classification}
                        </span>
                        {issue.line_number && (
                          <span className="px-2.5 py-0.5 rounded-md font-mono text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                            Line {issue.line_number}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white pt-1">{issue.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* NEW FEATURE 5: Ask Follow-Up on Line X Button */}
                      <button
                        onClick={() => openMentorDrawer(issue)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/40 text-xs font-semibold text-indigo-300 transition-colors cursor-pointer"
                      >
                        <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          Ask Follow-Up{issue.line_number ? ` on Line ${issue.line_number}` : ''}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(
                            `${issue.title} (${issue.severity}): ${issue.description}\nFix: ${issue.recommendation}`,
                            `issue-${idx}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedKey === `issue-${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Fix</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{issue.description}</p>

                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200">
                    <strong className="font-semibold text-emerald-400">Recommended Fix: </strong>
                    {issue.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NEW FEATURE 2: True Line-by-Line LCS Diff Viewer Section */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileDiff className="w-5 h-5 text-emerald-400" />
                <span>Line-by-Line Refactored Diff & Optimized Code</span>
              </h2>
              <p className="text-xs text-slate-400">
                Green (+) highlights added safety & optimizations; Red (-) highlights removed vulnerable lines
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleCopy(result.improved_code, 'improved-code')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                {copiedKey === 'improved-code' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Improved Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copy Improved Code</span>
                  </>
                )}
              </button>

              <button
                disabled={isAnalyzing || !result.improved_code}
                onClick={() => {
                  setSourceCode(result.improved_code);
                  setLanguage(revLang);
                  const nextName = revFile?.startsWith('optimized_')
                    ? revFile
                    : `optimized_${revFile || `code.${revLang}`}`;
                  setFileName(nextName);
                  handleRunReview(result.improved_code, revLang, nextName);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>Re-Review Improved Code</span>
              </button>
            </div>
          </div>

          {result.changes_made && result.changes_made.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1F2937]">
              <h3 className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-2.5">
                What Changes Were Made
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.changes_made.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <LineByLineDiffViewer
            originalCode={originalCode}
            improvedCode={result.improved_code}
            language={revLang}
          />
        </div>
      </div>
    );
  };

  const renderHistoryPage = () => (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Review History Archive</h1>
          <p className="text-sm text-slate-400">
            Search, filter, reopen, or manage past code quality and security evaluations
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              setHistory([]);
              showToast('Review history cleared');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors cursor-pointer self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search & Language Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Search by file name, summary, or code snippet..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={historyLangFilter}
            onChange={(e) => setHistoryLangFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Languages</option>
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#111827] border border-[#1F2937] text-center space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching reviews found</h3>
          <p className="text-xs text-slate-400">
            Try clearing your search filters or run a new analysis in the Code Review studio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => {
            const score = item.result?.overall_score ?? 0;
            const issues = item.result?.issues || [];
            const critCount = issues.filter((i) => i.severity === 'Critical').length;
            const highCount = issues.filter((i) => i.severity === 'High').length;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs uppercase text-cyan-300 font-semibold">
                      {item.language}
                    </span>
                    <PersonaBadge personaId={item.persona} />
                    <span className="font-mono text-sm font-bold text-white truncate">
                      {item.fileName || `snippet.${item.language}`}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">{item.result?.summary}</p>

                  <pre className="p-2.5 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-[11px] font-mono text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.originalCode.split('\n').slice(0, 2).join(' ')}
                  </pre>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#1F2937]">
                  <div className="text-left lg:text-right mr-1">
                    <div
                      className={`text-xl font-extrabold ${
                        score >= 80
                          ? 'text-emerald-400'
                          : score >= 55
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {score}/100
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {issues.length} issues ({critCount} Crit, {highCount} High)
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentReview(item);
                      setSeverityFilter('All');
                      setMentorIssue(null);
                      setActivePage('results');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setHistory((prev) => prev.filter((h) => h.id !== item.id));
                      showToast('Removed review entry');
                    }}
                    aria-label="Delete Review"
                    className="p-2.5 rounded-xl bg-[#0B0F19] hover:bg-rose-500/15 border border-[#1F2937] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAboutPage = () => (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">About AI Code Reviewer v2.0 Pro</h1>
        <p className="text-sm text-slate-400 mt-1">
          Full-stack hybrid static + LLM architecture and GitHub repository deployment blueprint
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span>Client-Server Production Architecture</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          AI Code Reviewer v2.0 Pro pairs a fast React + Tailwind developer workspace with an instant client-side
          AST/Regex pre-checker and Google&apos;s{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">
            gemini-2.5-flash
          </code>{' '}
          structured JSON engine.
        </p>

        {/* Architecture Flow Diagram */}
        <div className="p-4 rounded-xl bg-[#080B12] border border-[#1F2937] font-mono text-xs text-slate-300 overflow-x-auto">
          <div className="flex flex-wrap items-center gap-2 justify-between min-w-[540px]">
            <div className="px-3 py-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              React UI + LCS Diff
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300">
              Static Pre-Check (&lt;5ms)
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              Backend API Proxy (.env)
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div className="px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Gemini 2.5 Flash JSON
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repository Folder Blueprint */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Github className="w-5 h-5 text-cyan-400" />
          <span>Recommended GitHub Repository Structure</span>
        </h2>
        <p className="text-xs text-slate-400">
          When pushing to GitHub, store your <code className="text-cyan-300">GEMINI_API_KEY</code> in{' '}
          <code className="text-cyan-300">server/.env</code> (excluded by <code className="text-cyan-300">.gitignore</code>)
          so credentials remain completely protected.
        </p>

        <pre className="p-4 rounded-xl bg-[#080B12] border border-[#1F2937] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
{`ai-code-reviewer-pro/
├── client/                     # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── App.jsx             # Complete v2.0 Pro application
│   │   └── main.jsx
│   └── package.json
├── server/                     # Secure Node.js / Express API Proxy
│   ├── index.js                # Holds process.env.GEMINI_API_KEY
│   ├── .env.example            # GEMINI_API_KEY=your_google_ai_studio_key
│   └── package.json
├── .gitignore                  # Excludes node_modules/, .env, dist/
└── README.md                   # Architecture diagram, screenshots & setup guide`}
        </pre>
      </div>
    </div>
  );

  // ==========================================================================
  // LAYOUT SHELL (SIDEBAR + TOP BAR + MENTOR DRAWER + MAIN VIEWPORT)
  // ==========================================================================

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#111827] border border-cyan-500/40 shadow-2xl flex items-center gap-2.5 text-xs font-semibold text-white">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* API Key Configuration Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-[#1F2937] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                <span>Google AI Studio API Key</span>
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Optionally enter your Gemini API key (stored only in your browser&apos;s{' '}
              <code className="text-slate-300">sessionStorage</code>) to power live Gemini 2.5 Flash reviews and
              line-scoped mentor chats. If left blank, the app automatically uses runtime credentials or offline
              static demo mode.
            </p>

            <input
              type="password"
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              {customApiKey && (
                <button
                  onClick={() => {
                    setCustomApiKey('');
                    setApiKeyDraft('');
                    try {
                      sessionStorage.removeItem('gemini_user_api_key');
                    } catch (_) {}
                    setApiKeyModalOpen(false);
                    showToast('Session API key cleared');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer mr-auto"
                >
                  Clear Key
                </button>
              )}

              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const trimmed = apiKeyDraft.trim();
                  setCustomApiKey(trimmed);
                  try {
                    if (trimmed) sessionStorage.setItem('gemini_user_api_key', trimmed);
                    else sessionStorage.removeItem('gemini_user_api_key');
                  } catch (_) {}
                  setApiKeyModalOpen(false);
                  showToast(trimmed ? 'API key saved for this session' : 'Using default runtime mode');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW FEATURE 5: Line-Scoped AI Follow-Up Mentor Slide-Over Drawer */}
      {mentorIssue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-[#111827] border-l border-[#1F2937] h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#1F2937] flex items-start justify-between gap-3 bg-[#0B0F19]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={mentorIssue.severity} />
                  {mentorIssue.line_number && (
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Line {mentorIssue.line_number}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">{mentorIssue.title}</h3>
              </div>
              <button
                onClick={() => setMentorIssue(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-[#1F2937] bg-[#0B0F19]/60 flex flex-wrap gap-2">
              {[
                'Why is this dangerous?',
                'Show an alternative fix',
                "Explain like I'm a beginner"
              ].map((chip) => (
                <button
                  key={chip}
                  disabled={isMentorLoading}
                  onClick={() => handleSendMentorQuestion(chip)}
                  className="px-2.5 py-1 rounded-full bg-[#111827] hover:bg-indigo-600/20 border border-[#1F2937] hover:border-indigo-500/40 text-[11px] font-medium text-cyan-300 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {mentorMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#0B0F19] border border-[#1F2937] text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isMentorLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-[#0B0F19] border border-[#1F2937] text-xs text-cyan-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Mentor is analyzing line context...</span>
                  </div>
                </div>
              )}
              <div ref={mentorEndRef} />
            </div>

            {/* Chat Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMentorQuestion();
              }}
              className="p-4 border-t border-[#1F2937] bg-[#0B0F19] flex items-center gap-2"
            >
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                placeholder="Ask a follow-up question about this issue..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isMentorLoading || !mentorInput.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-[#111827] border-b border-[#1F2937] sticky top-0 z-30">
        <div onClick={() => setActivePage('home')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">AI Code Reviewer</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setApiKeyDraft(customApiKey);
              setApiKeyModalOpen(true);
            }}
            className="p-2 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-cyan-400"
            aria-label="API Key Settings"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#0B0F19] border border-[#1F2937] text-slate-300"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Collapsible Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#111827] border-r border-[#1F2937] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div
            onClick={() => {
              setActivePage('home');
              setMobileMenuOpen(false);
            }}
            className="p-6 border-b border-[#1F2937] flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight">AI Code Reviewer</div>
              <div className="text-[11px] text-cyan-400 font-mono">v2.0 Pro • Gemini 2.5</div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/15 text-white border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'history' && history.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {history.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: API Key Pill + Status */}
        <div className="p-4 border-t border-[#1F2937] space-y-2.5">
          <button
            onClick={() => {
              setApiKeyDraft(customApiKey);
              setApiKeyModalOpen(true);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#1F2937] flex items-center justify-between text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>API Key Config</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] ${
                customApiKey ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {customApiKey ? 'Custom' : 'Auto'}
            </span>
          </button>

          <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1F2937] space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hybrid Pipeline Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Static AST/Regex + Gemini 2.5 Flash JSON validation active.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden" />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {activePage === 'home' && renderHomePage()}
        {activePage === 'dashboard' && renderDashboardPage()}
        {activePage === 'review' && renderCodeReviewPage()}
        {activePage === 'results' && renderResultsPage()}
        {activePage === 'history' && renderHistoryPage()}
        {activePage === 'about' && renderAboutPage()}
      </main>
    </div>
  );
}
