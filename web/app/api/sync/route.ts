import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const repoRoot = path.resolve(process.cwd(), '..');
    const harvesterScript = path.join(repoRoot, 'scripts', 'harvest_resources.py');

    // Execute the Python harvester script
    const { stdout, stderr } = await execPromise(`python3 "${harvesterScript}"`, {
      cwd: repoRoot,
      timeout: 30000,
    });

    console.log('Harvester Output:', stdout);
    if (stderr) console.error('Harvester Stderr:', stderr);

    return NextResponse.json({
      success: true,
      message: 'Resources successfully harvested and synchronized!',
      timestamp: new Date().toISOString(),
      output: stdout,
    });
  } catch (error: any) {
    console.error('Error running resource harvester:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to harvest resources',
      },
      { status: 500 }
    );
  }
}
