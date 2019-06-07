const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

export default {
  OAUTH : 'fd46eea11ef874fb7eda2895e78b0fd1b907d835',
  user: 'booellean',
  perPage: 1000,
  port: env.PORT || 9001,
  host: env.HOST || '0.0.0.0',
}

//General query of all repos, public, private and organizations
//https://api.github.com/user/repos?access_token=fd46eea11ef874fb7eda2895e78b0fd1b907d835&per_page=1000