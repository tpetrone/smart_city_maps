module Mock
  class SpotsController < ApplicationController
    def search
      render json: JSON.load(
        File.read("#{Rails.root}/app/views/mock/spots/search.json"))
    end
  end
end
