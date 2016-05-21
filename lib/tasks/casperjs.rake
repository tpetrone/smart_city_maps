# Where JavaScript files are stored.
JAVASCRIPTS_DIR = "#{Rails.root}/app/assets/javascripts"

# Where to store the original JS files (prior to instrumentation).
JAVASCRIPTS_BACKUP_DIR = "#{Rails.root}/app/assets/javascripts-backup"

# Where to keep istanbul-related files
ISTANBUL_DIR = "#{Rails.root}/.istanbul"
REPORTS_DIR  = "#{ISTANBUL_DIR}/reports"
COVERAGE_DIR = "#{ISTANBUL_DIR}/coverage"

MINIMUM_COVERAGE = 80

namespace :spec do
  namespace :casperjs do

    desc 'Run CasperJS test suites'
    task :run do

      # Run CasperJS tests
      pid = Process.fork do
        exec "cd #{Rails.root} && script/casperjs.sh"
      end

      Process.waitpid2(pid)

      # Generate coverage reports
      %x[istanbul report --root #{COVERAGE_DIR} --dir #{REPORTS_DIR} html]
      %x[istanbul report --root #{COVERAGE_DIR} --dir #{REPORTS_DIR} json-summary]

      # Parse coverage reports
      cov = JSON.load(File.read("#{REPORTS_DIR}/coverage-summary.json"))

      puts
      puts "Coverage report generated for CasperJS to #{REPORTS_DIR}. " +
       "#{cov['total']['lines']['covered']} / #{cov['total']['lines']['total']} " +
       "LOC (#{cov['total']['lines']['pct'].round(2)}%) covered."

      # if cov['total']['lines']['pct'] <= MINIMUM_COVERAGE
      #   puts "Coverage < required minimum (#{MINIMUM_COVERAGE}%)"
      #   exit(1)
      # end
    end

    desc 'Prepare JS files to track coverage'
    task :prepare do
      %x[
        rm -rf #{JAVASCRIPTS_BACKUP_DIR} &&
        cp -r #{JAVASCRIPTS_DIR} #{JAVASCRIPTS_BACKUP_DIR} &&
        istanbul instrument --output #{ISTANBUL_DIR}/javascripts --embed-source --no-compact --preserve-comments -x "application.js" #{JAVASCRIPTS_DIR} &&
        cp  #{ISTANBUL_DIR}/javascripts/*.js #{JAVASCRIPTS_DIR}/ &&
        rm -f #{COVERAGE_DIR}/coverage*.json &&
        rm -rf #{REPORTS_DIR}/* &&
        rm -f #{ISTANBUL_DIR}/javascripts/*.js
      ]
    end

    desc 'Restore original JS files'
    task :restore do
      %x[
        mv #{JAVASCRIPTS_BACKUP_DIR}/* #{JAVASCRIPTS_DIR}/ &&
        rmdir #{JAVASCRIPTS_BACKUP_DIR}
      ]
    end
  end
end
