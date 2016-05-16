namespace :spec do
  desc "Run CasperJS test suites"
  task :casperjs do
    exec "cd #{Rails.root} && script/casperjs.sh"
  end
end
