import chalk from 'chalk';
import { promptCredentials } from '../utils/prompts';
import { testConnection } from '../utils/connection';
import {SessionState} from "../types/types";



export async function testConnectionCommand(state: SessionState): Promise<void> {
    console.log(chalk.cyan('\n🔹 Testing Source Database...'));
    const src = await promptCredentials('Source');
    const srcOk = await testConnection(src);

    if (srcOk) {
        state.sourceConfig = src;
        state.sourceConnected = true;
    } else {
        state.sourceConnected = false;
        return;
    }

    console.log(chalk.cyan('\n🔹 Testing Target Database...'));
    const tgt = await promptCredentials('Target');
    const tgtOk = await testConnection(tgt);

    if (tgtOk) {
        state.targetConfig = tgt;
        state.targetConnected = true;
    } else {
        state.targetConnected = false;
        return;
    }

    console.log(chalk.green('\n🎯 Both databases are reachable and ready!'));
}
