package controllers

import models.{Account, Category}
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

class Accounts extends Controller with AccountTable {
  import driver.api._

  val accountForm = Form(
    mapping(
      "id"        -> ignored(1),
      "login"     -> nonEmptyText,
      "password"     -> nonEmptyText
    )(Account.apply)(Account.unapply)
  )

  def create = Action.async { implicit request =>
    accountForm.bindFromRequest.fold(
      formWithErrors => {
        scala.concurrent.Future{BadRequest(formWithErrors.errorsAsJson)}
      },
      acc => {
        AccountTable.create(acc).map(_ => Ok(Json.toJson(acc)))
      }
    )
  }

}
