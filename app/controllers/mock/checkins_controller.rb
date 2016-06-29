module Mock
  class CheckinsController < ApplicationController
    def create
      if session[:checkin_count].blank?
        session[:checkin_count] = 0
      end

      if session[:checkin_count] == 0
        session[:checkin_count] += 1
        render_json 'create'
      elsif session[:checkin_count] == 1
        session[:checkin_count] += 1
        render_json 'create-errors', 422
      end
    end

    def checkout
      if session[:checkout_count].blank?
        session[:checkout_count] = 0
      end

      if session[:checkout_count] == 0
        session[:checkout_count] += 1
        render_json 'checkout'
      elsif session[:checkout_count] == 1
        session[:checkout_count] += 1
        render_json 'checkout-errors', 422
      else
        session[:checkout_count] += 1
        render nothing: true, status: 500
      end
    end

    def pending
      render_json 'pending'
    end

    private

    def render_json(view_name, status_code = :ok)
      render(
        json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/checkins/#{view_name}.json")),
        status: status_code
      )
    end
  end
end
