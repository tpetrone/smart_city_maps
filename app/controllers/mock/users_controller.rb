module Mock
  class UsersController < ApplicationController
    # REVIEW: Extract these JSON.load(...) calls to its own method.
    def signup
      if params[:email] == "user@valid.com"
        render json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/users/signup_success.json"))
      else
        render json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/users/signup_fail.json")),
        status: :unauthorized
      end
    end

    def signin
      if params[:email] == "user@valid.com"
        render json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/users/signin_success.json"))
      else
        render json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/users/signin_fail.json")),
        status: :unauthorized
      end
    end

    def signout
      if params[:error]
        render json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/users/signout_fail.json")),
        status: :bad_request
      else
        render json: JSON.load(
          File.read("#{Rails.root}/app/views/mock/users/signout_success.json"))
      end
    end
  end
end
