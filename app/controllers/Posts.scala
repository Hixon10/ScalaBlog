package controllers

import models.{Post, Category}
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

class Posts extends Controller with PostTable {
  import driver.api._

  def index = Action.async { implicit request =>
    val sort = request.getQueryString("sort").getOrElse("id")
    val desc = request.getQueryString("desc").getOrElse("0") == "1"
    PostTable.findAll(sort, desc).map(res => Ok(Json.toJson(res.toList)))
  }

  def show(id: Int) = Action.async {
    PostTable.findOne(id).map(res => Ok(Json.toJson(res.get)))
  }

  val postForm = Form(
    mapping(
      "id"        -> ignored(1),
      "title"     -> nonEmptyText,
      "content"     -> nonEmptyText,
      "categoryId"      -> number
    )(Post.apply)(Post.unapply)
  )

  def create(login: String, password: String) = Action.async { implicit request =>
    if (!AccountTable.checkAccount(login, password)) {
      scala.concurrent.Future{BadRequest("There is no account with login " + login)}
    } else {
      postForm.bindFromRequest.fold(
        formWithErrors => {
          scala.concurrent.Future {
            BadRequest(formWithErrors.errorsAsJson)
          }
        },
        p => {
          PostTable.create(p).map(_ => Ok(Json.toJson(p)))
        }
      )
    }
  }

  def update(id: Int, login: String, password: String) = Action.async { implicit request =>
    if (!AccountTable.checkAccount(login, password)) {
      scala.concurrent.Future{BadRequest("There is no account with login " + login)}
    } else {
      postForm.bindFromRequest.fold(
        formWithErrors => {
          scala.concurrent.Future {
            BadRequest(formWithErrors.errorsAsJson)
          }
        },
        p => {
          PostTable.update(id, p).map(_ => Ok(Json.toJson(p)))
        }
      )
    }
  }

  def delete(id: Int, login: String, password: String) = Action.async {
    if (!AccountTable.checkAccount(login, password)) {
      scala.concurrent.Future{BadRequest("There is no account with login " + login)}
    } else {
      PostTable.destroy(id).map(_ => Ok(Json.toJson("deleted")))
    }
  }

}
