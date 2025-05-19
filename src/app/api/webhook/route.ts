import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { WebhookRequestBody } from '~/types/Webhook';

const deployScript = '/home/keiran/prod/slop-new/deploy.sh';

export async function POST(request: Request): Promise<Response> {
  const body: WebhookRequestBody = await request.json();

  console.log('Received webhook. Request body:', JSON.stringify(body, null, 2));

  if (body && body.ref === 'refs/heads/main') {
    console.log('Received push to main. Deploying...');

    exec(
      deployScript,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );

    return NextResponse.json(
      { message: 'Deployment initiated' },
      { status: 200 }
    );
  } else {
    console.log(
      `Not a push to main. Received ref: ${body ? body.ref : 'undefined'}`
    );
    return NextResponse.json(
      { message: 'Not a push to main, ignoring' },
      { status: 200 }
    );
  }
}
