package controllers

import models.Category
import tables._
import play.api._
import play.api.data._
import play.api.data.Forms._
import play.api.mvc._
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import play.api.mvc.BodyParsers._
import play.api.libs.concurrent.Execution.Implicits.defaultContext

import scala.concurrent.Future
import scala.concurrent.duration._
import play.api.libs.json._

class Categories extends Controller with CategoryTable {
  import driver.api._

  def index = Action.async { implicit request =>
    val sort = request.getQueryString("sort").getOrElse("id")
    val desc = request.getQueryString("desc").getOrElse("0") == "1"
    CategoryTable.findAll(sort, desc).map(res => Ok(Json.toJson(res.toList)))
  }

  def show(id: Int) = Action.async {
    CategoryTable.findOne(id).map(res => Ok(Json.toJson(res.get)))
  }

  val categoryForm = Form(
    mapping(
      "id"        -> ignored(1),
      "title"     -> nonEmptyText
    )(Category.apply)(Category.unapply)
  )

  def create(login: String, password: String) = Action.async { implicit request =>
    categoryForm.bindFromRequest.fold(
      formWithErrors => {
        scala.concurrent.Future{BadRequest(formWithErrors.errorsAsJson)}
      },
      cat => {
        CategoryTable.create(cat).map(_ => Ok(Json.toJson(cat)))
      }
    )
  }

  def update(id: Int, login: String, password: String) = Action.async { implicit request =>
    categoryForm.bindFromRequest.fold(
      formWithErrors => {
        scala.concurrent.Future{BadRequest(formWithErrors.errorsAsJson)}
      },
      cat => {
        CategoryTable.update(id, cat).map(_ => Ok(Json.toJson(cat)))
      }
    )
  }

  def delete(id: Int, login: String, password: String) = Action.async {
    CategoryTable.destroy(id).map(_ => Ok(Json.toJson("deleted")))
  }

}
