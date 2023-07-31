<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProject extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "project_id",
        "is_admin"
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, "user_id");
    }
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id")->with('states');
    }
    public function epics(){
        return $this->hasMany(Epic::class);
    }
    public function stories(){
        return $this->hasMany(Story::class);
    }


}
