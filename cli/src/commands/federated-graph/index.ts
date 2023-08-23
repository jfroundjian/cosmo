import { Command } from 'commander';
import { BaseCommandOptions } from '../../core/types/types.js';
import CreateFederatedGraphCommand from './commands/create.js';
import FetchFederatedGraphCommand from './commands/fetch.js';
import DeleteFederatedGraphCommand from './commands/delete.js';
import UpdateFederatedGraphCommand from './commands/update.js';
import CheckFederatedGraphCommand from './commands/check.js';
import CreateFederatedGraphToken from './commands/create-token.js';
import FetchRouterConfig from './commands/fetch-config.js';

export default (opts: BaseCommandOptions) => {
  const schema = new Command('federated-graph');
  schema.description('Provides commands for creating and managing a federated graph');
  schema.addCommand(CreateFederatedGraphCommand(opts));
  schema.addCommand(FetchFederatedGraphCommand(opts));
  schema.addCommand(DeleteFederatedGraphCommand(opts));
  schema.addCommand(UpdateFederatedGraphCommand(opts));
  schema.addCommand(CheckFederatedGraphCommand(opts));
  schema.addCommand(CreateFederatedGraphToken(opts));
  schema.addCommand(FetchRouterConfig(opts));
  return schema;
};