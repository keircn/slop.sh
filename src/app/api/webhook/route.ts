// src/app/api/webhook/route.ts

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { WebhookRequestBody } from '~/types/Webhook';

const deployScript = '/home/keiran/prod/slop-new/deploy.sh';

const logDirectory = '/home/keiran/prod/slop-new/logs';
const logFilePath = path.join(logDirectory, 'deploy.log');

if (!fs.existsSync(logDirectory)) {
  try {
    fs.mkdirSync(logDirectory, { recursive: true });
    console.log(`Created log directory: ${logDirectory}`);
  } catch (err) {
    console.error('Failed to create log directory:', err);
  }
}

const appendLog = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
      console.error(`[Log Fallback] ${logMessage}`);
    }
  });
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body: WebhookRequestBody = await request.json();

    const receivedMessage = `Received webhook. Request body: ${JSON.stringify(body, null, 2)}`;
    appendLog(receivedMessage);
    console.log(receivedMessage);

    if (body && body.ref === 'refs/heads/main') {
      const deployInitiatedMessage =
        'Received push to main. Initiating deployment...';
      appendLog(deployInitiatedMessage);
      console.log(deployInitiatedMessage);

      exec(
        deployScript,
        (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            const errorMessage = `exec error: ${error}`;
            appendLog(errorMessage);
            console.error(errorMessage);
          }
          if (stdout) {
            const stdoutMessage = `stdout: ${stdout}`;
            appendLog(stdoutMessage);
            console.log(stdoutMessage);
          }
          if (stderr) {
            const stderrMessage = `stderr: ${stderr}`;
            appendLog(`[STDERR] ${stderrMessage}`);
            console.error(`[STDERR] ${stderrMessage}`);
          }
          appendLog('Deployment script finished.');
          console.log('Deployment script finished.');
        }
      );

      return NextResponse.json(
        { message: 'Deployment initiated' },
        { status: 200 }
      );
    } else {
      const ignoreMessage = `Not a push to main. Received ref: ${body ? body.ref : 'undefined'}`;
      appendLog(ignoreMessage);
      console.log(ignoreMessage);
      return NextResponse.json(
        { message: 'Not a push to main, ignoring' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    const errorMessage = `Error processing webhook: ${error instanceof Error ? error.message : String(error)}`;
    appendLog(errorMessage);
    console.error(errorMessage);
    return NextResponse.json(
      { message: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
